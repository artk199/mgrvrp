package mgrvrp.rest

import groovy.json.JsonBuilder
import org.springframework.messaging.simp.SimpMessagingTemplate
import pl.mgr.vrp.VRPCalcThread
import pl.mgr.vrp.VRPProblem

class SavingsAlgorithmService extends VRPCalcThread {

    SimpMessagingTemplate brokerMessagingTemplate

    SavingsAlgorithmService(VRPProblem vrpProblem) {
        super(vrpProblem)
    }

    @Override
    void solve(VRPProblem problem) {
        100.times {
            sleep(100)
            def builder = new JsonBuilder()
            builder {
                message("${it} times")
                timestamp(new Date())
            }

            //Note the lack of the leading /user compared to what the webpage subscribes to
            // - this is added automatically
            brokerMessagingTemplate.convertAndSend "/topic/hello", builder
        }
    }

}
