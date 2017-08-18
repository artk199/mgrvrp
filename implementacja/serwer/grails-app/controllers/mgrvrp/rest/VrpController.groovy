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

    @MessageMapping("/vrp")
    protected def index(String problem) {
        log.debug "Uruchomiono proces rozwiazywania VRP"
        def jsonSlurper = new JsonSlurper()
        VRPProblem vrpProblem = VRPProblem.create(jsonSlurper.parseText(problem)['problem'])
        validateVRPProblem(vrpProblem)
        VRPService vrpService = savingsAlgorithmService
        vrpService.solve(vrpProblem)
    }

    private void validateVRPProblem(VRPProblem vrpProblem) {
        if (!vrpProblem)
            throw new VRPControllerException("Brak podanego problemu")

        if (!vrpProblem.validate()) {
            String message = ""
            vrpProblem.errors.fieldErrors.each {
                message += "${it.field} : ${it.rejectedValue}\n"
            }
            throw new VRPControllerException("Niepoprawny format problemu:\n ${message}")
        }
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
