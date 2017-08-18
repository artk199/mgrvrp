package mgrvrp.rest

import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import pl.mgr.vrp.VRPControllerException

import pl.mgr.vrp.VRPService
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPSolution

@Slf4j
class VrpController{

    JspritVRPService jspritVRPService
    SavingsAlgorithmService savingsAlgorithmService
    RandomRoutesService randomRoutesService

    @MessageMapping("/vrp")
    protected def index(String problem) {
        log.debug "Uruchomiono proces rozwiazywania VRP"
        VRPService vrpService = savingsAlgorithmService
        def jsonSlurper = new JsonSlurper()
        Map parsedProblem = jsonSlurper.parseText(problem)
        VRPProblem vrpProblem = VRPProblem.create(parsedProblem['problem'])
        vrpProblem.maxCapacity = parsedProblem['settings']['capacity']
        switch (parsedProblem['settings']['algorithm']){
            case 'jsprit':
                vrpService = jspritVRPService
                break
            case 'random':
                vrpService = randomRoutesService
                break
            case 'savings':
                vrpService = savingsAlgorithmService
        }
        vrpService.solve(vrpProblem)
    }

    def handleVRPControllerException(VRPControllerException exception){
        log.error "Blad podczas zapytania: ${exception.message}"
        render status: 400, text:exception.message
    }

    @MessageMapping("/hello")
    @SendTo("/topic/hello")
    protected String hello(String world) {
        println "world"
        //brokerMessagingTemplate.convertAndSend "/topic/hello", world
        return "hello from controller, ${world}!"
    }

}
