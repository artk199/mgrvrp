package pl.mgr.vrp

import grails.converters.JSON
import grails.transaction.Transactional
import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import org.springframework.messaging.handler.annotation.MessageMapping
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPSolution

@Slf4j
class VrpController {

    EntryVRPService entryVRPService

    @MessageMapping("/vrp")
    protected def index(String problem) {
        log.debug "Uruchomiono proces rozwiazywania VRP"
        VRPProblem vrpProblem = VRPProblem.create(new JsonSlurper().parseText(problem))
        entryVRPService.prepareAndSolve(vrpProblem)
    }

    @Transactional
    def vrp_xhr(ProblemWithSettings problemWithSettings) {
        problemWithSettings.problem.save(failOnError: true)
        VRPSolution solution = entryVRPService.prepareAndSolve(problemWithSettings)
        solution.save(failOnError: true)
        def ret = [
                type     : "END",
                message  : solution,
                timestamp: new Date()
        ]
        JSON.use('deep') {
            render ret as JSON
        }
    }

}

