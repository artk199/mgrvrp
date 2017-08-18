package pl.mgr.vrp

import groovy.json.JsonBuilder
import groovy.util.logging.Slf4j
import mgrvrp.rest.GraphHopperOSMService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import pl.mgr.vrp.model.VRPPoint
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPSolution

@Slf4j
abstract class VRPService {

    @Autowired
    SimpMessagingTemplate brokerMessagingTemplate

    @Autowired
    GraphHopperOSMService graphHopperOSMService

    abstract protected VRPSolution calculateSolution(VRPProblem problem)

    VRPSolution solve(VRPProblem problem){
        VRPSolution solution = calculateSolution(problem)
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
        log.info info
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

    def calculateDriveRoute(VRPSolution solution) {
        solution.routes.each { route ->
            def lastPoint = route.start
            route.driveRoute = []
            route.points.each { point ->
                route.driveRoute += graphHopperOSMService.calculateRoute(lastPoint,point)
                lastPoint = point
            }
            route.driveRoute += graphHopperOSMService.calculateRoute(lastPoint,route.end)
            logStep(solution)
        }
    }

    def calculateNormalRoute(VRPSolution solution) {
        solution.routes.each { route ->
            route.driveRoute = [
                    new VRPPoint(route.start.coordinates.x,route.start.coordinates.y)
            ]
            route.points.each { point ->
                route.driveRoute += new VRPPoint(point.coordinates.x,point.coordinates.y)
            }
            route.driveRoute += new VRPPoint(route.end.coordinates.x,route.end.coordinates.y)
        }
        logStep(solution)
    }
}