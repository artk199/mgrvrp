package pl.mgr.vrp

import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import pl.mgr.vrp.model.VRPPoint
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPSolution

@Slf4j
abstract class VRPSolverService {

    @Autowired
    SimpMessagingTemplate brokerMessagingTemplate

    @Autowired
    GraphHopperOSMService graphHopperOSMService

    @Autowired
    RoutingUtilService routingUtilService

    abstract protected VRPSolution calculateSolution(VRPProblem problem)

    VRPSolution solve(VRPProblem problem){
        try {
            validateVRPProblem(problem)
            VRPSolution solution = calculateSolution(problem)
            calculateRoute(problem,solution)
            sendEndSignal(solution)
            return solution
        }catch (IllegalArgumentException ex){
            log.error(ex.message)
            logRuntimeError(ex.message)
        }catch (Exception e){
            e.printStackTrace()
            logRuntimeError("Nieznany blad...")
        }
        return null
    }

    def logRuntimeError(String _message) {
        def builder = new JsonBuilder()
        builder {
            type "RUNTIME_ERROR"
            message _message
            timestamp new Date()
        }
        send(builder)
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

    private void validateVRPProblem(VRPProblem vrpProblem) {
        if (!vrpProblem)
            throw new IllegalArgumentException("Brak podanego problemu")

        if (!vrpProblem.validate()) {
            String message = ""
            vrpProblem.errors.fieldErrors.each {
                message += "${it.field} : ${it.rejectedValue}\n"
            }
            log.error message
            throw new IllegalArgumentException("Niepoprawny format problemu.")
        }
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

    def calculateRoadRoute(VRPSolution solution) {
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

    def calculateAirRoute(VRPSolution solution) {
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

    def calculateDistances(VRPProblem vrpProblem) {
        logInfo "Obliczanie odleglosci..."
        def methodName = "calculate${vrpProblem.distanceType?.capitalize()}DistanceMatrix"
        double[][] distances = routingUtilService."$methodName"(vrpProblem)
        log.debug "Macierz odleglosci:"
        log.debug "\n" + JsonOutput.prettyPrint(JsonOutput.toJson(distances))
        distances
    }

    def calculateRoute(VRPProblem problem, VRPSolution solution) {
        this."calculate${problem.distanceType?.capitalize()}Route"(solution)
    }
}