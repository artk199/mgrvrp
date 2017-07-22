package mgrvrp.rest

import grails.converters.JSON
import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import pl.mgr.vrp.VRPControllerException
import pl.mgr.vrp.VRPProblem
import pl.mgr.vrp.VRPSolution

@Slf4j
class VrpController{

    JspritVRPService jspritVRPService

    @MessageMapping("/vrp")
    protected def index(String problem) {
        def jsonSlurper = new JsonSlurper()
        VRPProblem vrpProblem = new VRPProblem(jsonSlurper.parseText(problem))
        validateVRPProblem(vrpProblem)
        VRPSolution s = jspritVRPService.solve(vrpProblem)
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
