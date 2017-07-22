package pl.mgr.vrp

import groovy.json.JsonBuilder
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate

@Slf4j
abstract class VRPService {

    @Autowired
    SimpMessagingTemplate brokerMessagingTemplate

    abstract protected VRPSolution caluculateSolution(VRPProblem problem)

    VRPSolution solve(VRPProblem problem){
        VRPSolution solution = caluculateSolution(problem)
        sendEndSignal(solution)
        return solution
    }

    def sendEndSignal(VRPSolution solution) {
        def builder = new JsonBuilder()
        builder {
            type "END"
            message solution
            timestamp new Date()
        }
        send(builder)
    }

    void logInfo(String info){
        def builder = new JsonBuilder()
        builder {
            type "INFO"
            message(info)
            timestamp(new Date())
        }
        send(builder)
    }

    void logStep(VRPSolution solution){
        def builder = new JsonBuilder()
        builder {
            type "STEP"
            message solution
            timestamp new Date()
        }
        send(builder)
    }

    void send(JsonBuilder jsonBuilder) {
        brokerMessagingTemplate.convertAndSend "/topic/hello", jsonBuilder
    }

}