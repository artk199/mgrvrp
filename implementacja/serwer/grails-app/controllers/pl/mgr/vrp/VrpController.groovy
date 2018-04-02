package pl.mgr.vrp

import grails.async.web.AsyncGrailsWebRequest
import grails.converters.JSON
import grails.transaction.Transactional
import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import org.grails.plugins.web.async.GrailsAsyncContext
import org.grails.web.util.GrailsApplicationAttributes
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.web.context.request.async.AsyncWebRequest
import org.springframework.web.context.request.async.WebAsyncManager
import org.springframework.web.context.request.async.WebAsyncUtils
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPSolution
import rx.Subscriber
import rx.observables.BlockingObservable

@Slf4j
class VrpController {

    public static final String CONTENT_TYPE_EVENT_STREAM = 'text/event-stream'

    EntryVRPService entryVRPService

    @MessageMapping("/vrp")
    protected def index(String problem) {
        log.debug "Uruchomiono proces rozwiazywania VRP"
        VRPProblem vrpProblem = VRPProblem.create(new JsonSlurper().parseText(problem))
        entryVRPService.prepareAndSolve(vrpProblem)
    }

    def solve(ProblemWithSettings problemWithSettings) {
        String solverCode = entryVRPService.createSolverSubject(problemWithSettings);
        render status: 200, text: solverCode
    }


    @Transactional
    def xhrComet(String code) {
        SolverEvent solutionEvent = entryVRPService.getSolverSubjectValue(code)
        if (solutionEvent.eventType == SolverEventType.END)
            entryVRPService.removeSolverSubject(code)
        JSON.use('deep') {
            render solutionEvent as JSON
        }
    }


    def shortPolling(String code) {
        SolverEvent solutionEvent = entryVRPService.getSolverSubjectValue(code, false)
        if (!solutionEvent) {
            render text: ""
            return
        }
        if (solutionEvent.eventType == SolverEventType.END)
            entryVRPService.removeSolverSubject(code)
        JSON.use('deep') {
            render solutionEvent as JSON
        }
    }

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
                def json
                JSON.use('deep') {
                    json = solutionEvent as JSON
                }
                response << 'event: message\n'
                response << "data: ${json.toString()}\n\n"
                response.flushBuffer()
                if (solutionEvent.eventType == SolverEventType.END) {
                    exitCondition = true
                    entryVRPService.removeSolverSubject(code)
                }
            }
            response.flushBuffer()
        }
    }

}

