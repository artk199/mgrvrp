package pl.mgr.vrp

import grails.async.web.AsyncGrailsWebRequest
import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService
import grails.transaction.Transactional
import groovy.util.logging.Slf4j
import org.grails.plugins.web.async.GrailsAsyncContext
import org.grails.web.util.GrailsApplicationAttributes
import org.springframework.web.context.request.async.AsyncWebRequest
import org.springframework.web.context.request.async.WebAsyncManager
import org.springframework.web.context.request.async.WebAsyncUtils
import pl.mgr.vrp.model.VRPProblem


@Slf4j
@Transactional
class VrpController {

    public static final String CONTENT_TYPE_EVENT_STREAM = 'text/event-stream'

    EntryVRPService entryVRPService
    SpringSecurityService springSecurityService

    /**
     * Saves all problems into the database
     */
    @Transactional
    def saveAll(ProblemsList problemsList) {
        User user = springSecurityService.currentUser
        problemsList.problems.each { VRPProblem problem ->
            fixRoutes(problem)
        }
        VRPProblem.findAllByOwner(user).collect().each { p ->
            if (!problemsList.problems.any { it.id == p.id })
                p.delete()
        }
        problemsList.problems.each { VRPProblem problem ->
            problem.owner = user
            problem.save(failOnError: true)
        }
        render status: 200
    }

    def fixRoutes(VRPProblem vrpProblem) {
        def correctCustomers = vrpProblem.customers.collect()
        vrpProblem.solutions?.each { solution ->
            solution.routes.each { r ->
                def newPoints = []
                r.points.each { customer ->
                    newPoints.add correctCustomers.find { it.name == customer.name }
                }
                r.points = newPoints
            }
        }
    }


    def getAll() {
        User user = springSecurityService.currentUser
        def problems = VRPProblem.findAllByOwner(user);
        JSON.use('deep') {
            render problems as JSON
        }
    }

    /**
     * Renders a unique code representing solving subject.
     * @param problemWithSettings
     * @return
     */
    def solve(ProblemWithSettings problemWithSettings) {
        String solverCode = entryVRPService.createSolverSubject(problemWithSettings);
        render status: 200, text: solverCode
    }

    /**
     * Using XHR Comet waits for the solving event.
     * @param code
     * @return
     */
    def xhrComet(String code) {
        SolverEvent solutionEvent = entryVRPService.getSolverSubjectValue(code)
        if (solutionEvent.eventType == SolverEventType.END)
            entryVRPService.removeSolverSubject(code)
        render solutionEvent.toJson()
    }

    /**
     * Check if solving event is available and if it does renders it otherwise sens an empty response.
     * @param code
     * @return
     */
    def shortPolling(String code) {
        SolverEvent solutionEvent = entryVRPService.getSolverSubjectValue(code, false)
        if (!solutionEvent) {
            render text: ""
            return
        }
        if (solutionEvent.eventType == SolverEventType.END)
            entryVRPService.removeSolverSubject(code)
        render solutionEvent.toJson()
    }

    /**
     * Send solution events via server-sent events.
     * @param code
     * @return
     */
    def serverSentEvents(String code) {
        webRequest.setRenderView(false)
        WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request)
        AsyncWebRequest asyncWebRequest = new AsyncGrailsWebRequest(
                request,
                response,
                webRequest.servletContext)
        asyncManager.setAsyncWebRequest(asyncWebRequest)

        asyncWebRequest.startAsync()
        request.setAttribute(GrailsApplicationAttributes.ASYNC_STARTED, true)

        GrailsAsyncContext asyncContext = new GrailsAsyncContext(asyncWebRequest.asyncContext, webRequest)
        response.setContentType(CONTENT_TYPE_EVENT_STREAM)
        response.flushBuffer()

        asyncContext.start {
            boolean exitCondition = false
            while (!exitCondition) {
                SolverEvent solutionEvent = entryVRPService.getSolverSubjectValue(code)
                sendSolutionEventMessage(solutionEvent)
                if (solutionEvent.eventType == SolverEventType.END) {
                    exitCondition = true
                    entryVRPService.removeSolverSubject(code)
                }
            }
            response.flushBuffer()
        }
    }

    private void sendSolutionEventMessage(SolverEvent solutionEvent) {
        def json = solutionEvent.toJson()
        response << 'event: message\n'
        response << "data: ${json.toString()}\n\n"
        response.flushBuffer()
    }

}

class ProblemsList {
    List<VRPProblem> problems = []
}
