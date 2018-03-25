package pl.mgr.vrp

import groovy.json.JsonBuilder
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import pl.mgr.vrp.model.VRPDrivePoint
import pl.mgr.vrp.model.VRPLocation
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

    abstract protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings)

    VRPSolution solve(ProblemWithSettings problemWithSettings) {
        try {
            validateVRPProblem(problemWithSettings.problem)
            VRPSolution solution = calculateSolution(problemWithSettings)
            calculateRoute(solution, problemWithSettings.distanceType)
            sendEndSignal(solution)
            return solution
        } catch (IllegalArgumentException ex) {
            log.error(ex.message)
            logRuntimeError(ex.message)
        } catch (Exception e) {
            e.printStackTrace()
            logRuntimeError("Nieznany blad...")
        }
        return null
    }

    def assignIDs(VRPProblem problem) {
        int i = 1
        problem.customers.each {
            it._ID = i
            i++
        }
        problem.depot._ID = 0
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

    void logInfo(String info) {
        log.info info
        def builder = new JsonBuilder()
        builder {
            type "INFO"
            message(info)
            timestamp(new Date())
        }
        send(builder)
    }

    void logStep(VRPSolution solution) {
        def builder = new JsonBuilder()
        builder {
            type "STEP"
            message solution
            timestamp new Date()
        }
        send(builder)
    }

    void send(JsonBuilder jsonBuilder) {
        //brokerMessagingTemplate.convertAndSend "/topic/hello", jsonBuilder
    }

    def calculateRoadRoute(VRPSolution solution) {
        solution.routes.each { route ->
            VRPLocation lastPoint = solution.problem.depot
            route.drivePoints = []
            route.points.each { point ->
                List<VRPPoint> points = graphHopperOSMService.calculateRoute(lastPoint, point)
                VRPDrivePoint drivePoint = new VRPDrivePoint(points)
                for (int i = 1; i < drivePoint.points.size(); i++) {
                    drivePoint.routeLength += routingUtilService.calculateDistanceForSphericalEarth(drivePoint.points[i - 1], drivePoint.points[i])
                }
                route.addToDrivePoints drivePoint
                lastPoint = point
            }
            VRPDrivePoint drivePoint = new VRPDrivePoint(graphHopperOSMService.calculateRoute(lastPoint, solution.problem.depot))
            for (int i = 1; i < drivePoint.points.size(); i++) {
                drivePoint.routeLength += routingUtilService.calculateDistanceForSphericalEarth(drivePoint.points[i - 1], drivePoint.points[i])
            }

            route.addToDrivePoints drivePoint
            route.routeLength = 0
            route.drivePoints.each {
                route.routeLength += it.routeLength
            }

            //logStep(solution)
        }
    }

    def calculateAirRoute(VRPSolution solution) {
        solution.routes.each { route ->
            VRPLocation lastPoint = solution.problem.depot
            route.drivePoints = []
            route.points.each { point ->
                def drivePoint = new VRPDrivePoint([
                        new VRPPoint(lastPoint.x, lastPoint.y),
                        new VRPPoint(point.x, point.y)
                ])
                for (int i = 1; i < drivePoint.points.size(); i++) {
                    drivePoint.routeLength += routingUtilService.calculateDistanceForSphericalEarth(drivePoint.points[i - 1], drivePoint.points[i])
                }
                route.addToDrivePoints drivePoint
                lastPoint = point
            }

            def drivePoint = new VRPDrivePoint([
                    new VRPPoint(lastPoint.x, lastPoint.y),
                    new VRPPoint(solution.problem.depot.x, solution.problem.depot.y)
            ])
            for (int i = 1; i < drivePoint.points.size(); i++) {
                drivePoint.routeLength += routingUtilService.calculateDistanceForSphericalEarth(drivePoint.points[i - 1], drivePoint.points[i])
            }
            route.addToDrivePoints drivePoint
            route.routeLength = 0
            route.drivePoints.each {
                route.routeLength += it.routeLength
            }
        }
        //logStep(solution)
    }

    def calculateSimpleRoute(VRPSolution solution) {
        solution.routes.each { route ->
            def lastPoint = route.points.first()
            route.drivePoints = []
            route.points.each { point ->
                def drivePoint = new VRPDrivePoint([
                        new VRPPoint(lastPoint.x, lastPoint.y),
                        new VRPPoint(point.x, point.y)
                ])
                for (int i = 1; i < drivePoint.points.size(); i++) {
                    drivePoint.routeLength += routingUtilService.calculateSimpleDistance(drivePoint.points[i - 1], drivePoint.points[i])
                }
                route.addToDrivePoints drivePoint
                lastPoint = point
            }
            def drivePoint = new VRPDrivePoint([
                    new VRPPoint(lastPoint.x, lastPoint.y),
                    new VRPPoint(route.points.last().x, route.points.last().y)
            ])
            for (int i = 1; i < drivePoint.points.size(); i++) {
                drivePoint.routeLength += routingUtilService.calculateSimpleDistance(drivePoint.points[i - 1], drivePoint.points[i])
            }
            route.addToDrivePoints drivePoint
            route.routeLength = 0
            route.drivePoints.each {
                route.routeLength += it.routeLength
            }
        }
    }

    double[][] calculateDistances(VRPProblem vrpProblem, String distanceType) {
        logInfo "Obliczanie odleglosci..."
        def methodName = "calculate${distanceType?.capitalize()}DistanceMatrix"
        return routingUtilService."$methodName"(vrpProblem)
    }

    def calculateRoute(VRPSolution solution, String distanceType) {
        this."calculate${distanceType.capitalize()}Route"(solution)
        solution.routeLength = 0
        solution.routes.each {
            solution.routeLength += it.routeLength
        }
    }
}