package pl.mgr.vrp

import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import pl.mgr.vrp.model.VRPProblem

@Slf4j
class VrpController{

    EntryVRPService entryVRPService

    @MessageMapping("/vrp")
    protected def index(String problem) {
        log.debug "Uruchomiono proces rozwiazywania VRP"
        VRPProblem vrpProblem = VRPProblem.create(new JsonSlurper().parseText(problem))
        entryVRPService.prepareAndSolve(vrpProblem)
    }

    @MessageMapping("/hello")
    @SendTo("/topic/hello")
    protected String hello(String world) {
        println "world"
        //brokerMessagingTemplate.convertAndSend "/topic/hello", world
        return "hello from controller, ${world}!"
    }

}
