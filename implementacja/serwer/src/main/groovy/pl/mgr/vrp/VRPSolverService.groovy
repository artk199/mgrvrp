package pl.mgr.vrp

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import pl.mgr.vrp.model.VRPDrivePoint
import pl.mgr.vrp.model.VRPLocation
import pl.mgr.vrp.model.VRPPoint
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPSolution
import rx.Observable
import rx.Subscriber;
import static grails.async.Promises.*

@Slf4j
abstract class VRPSolverService {

    @Autowired
    SimpMessagingTemplate brokerMessagingTemplate

    abstract
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings, double[][] distances = null)

    Observable<SolverEvent> solve(ProblemWithSettings problemWithSettings) {
        return Observable.create([call: { Subscriber<SolverEvent> subscriber ->
            problemWithSettings.subscriber = subscriber
            //task {
                try {
                    VRPSolution solution
                    //validateVRPProblem(problemWithSettings.problem)
                    solution = calculateSolution(problemWithSettings)
                    calculateRoute(solution, problemWithSettings.distanceType)
                    subscriber.onNext(new SolverEvent(message: "Solution ready!", eventType: SolverEventType.END, solution: solution))
                    subscriber.onCompleted()
                } catch (Exception e) {
                    e.printStackTrace()
                    subscriber.onError(e)
                }
            //}
        }] as Observable.OnSubscribe<SolverEvent>)

    }

    static def assignIDs(VRPProblem problem) {
        int i = 1
        problem.customers.each {
            it._ID = i
            i++
        }
        problem.depot._ID = 0
    }

    static void logInfo(String info) {
        log.info info
    }

    static void logStep(Subscriber<SolverEvent> subscriber, VRPSolution solution, String message = "") {
        SolverEvent event = new SolverEvent(solution: solution, message: message)
        subscriber.onNext(event)
    }

    static def calculateRoadRoute(VRPSolution solution) {
        solution.routes.each { route ->
            VRPLocation lastPoint = solution.problem.depot
            route.drivePoints = []
            route.points.each { point ->
                VRPDrivePoint drivePoint = RoutingDistanceUtil.calculateRoute(lastPoint, point)
                route.drivePoints.add drivePoint
                lastPoint = point
            }
            VRPDrivePoint drivePoint = RoutingDistanceUtil.calculateRoute(lastPoint, solution.problem.depot)
            route.drivePoints.add drivePoint
            route.routeLength = 0
            route.drivePoints.each {
                route.routeLength += it.routeLength
            }
        }
    }

    static def calculateAirRoute(VRPSolution solution) {
        solution.routes.each { route ->
            VRPLocation lastPoint = solution.problem.depot
            route.drivePoints = []
            route.points.each { point ->
                def drivePoint = new VRPDrivePoint([
                        new VRPPoint(lastPoint.x, lastPoint.y),
                        new VRPPoint(point.x, point.y)
                ])
                for (int i = 1; i < drivePoint.points.size(); i++) {
                    drivePoint.routeLength += RoutingDistanceUtil.calculateDistanceForSphericalEarth(drivePoint.points[i - 1], drivePoint.points[i])
                }
                route.drivePoints.add drivePoint
                lastPoint = point
            }

            def drivePoint = new VRPDrivePoint([
                    new VRPPoint(lastPoint.x, lastPoint.y),
                    new VRPPoint(solution.problem.depot.x, solution.problem.depot.y)
            ])
            for (int i = 1; i < drivePoint.points.size(); i++) {
                drivePoint.routeLength += RoutingDistanceUtil.calculateDistanceForSphericalEarth(drivePoint.points[i - 1], drivePoint.points[i])
            }
            route.drivePoints.add drivePoint
            route.routeLength = 0
            route.drivePoints.each {
                route.routeLength += it.routeLength
            }
        }
        //logStep(solution)
    }

    static def calculateSimpleRoute(VRPSolution solution) {
        solution.routes.each { route ->
            def lastPoint = route.points.first()
            route.drivePoints = []
            route.points.each { point ->
                def drivePoint = new VRPDrivePoint([
                        new VRPPoint(lastPoint.x, lastPoint.y),
                        new VRPPoint(point.x, point.y)
                ])
                for (int i = 1; i < drivePoint.points.size(); i++) {
                    drivePoint.routeLength += RoutingDistanceUtil.calculateSimpleDistance(drivePoint.points[i - 1], drivePoint.points[i])
                }
                route.addToDrivePoints drivePoint
                lastPoint = point
            }
            def drivePoint = new VRPDrivePoint([
                    new VRPPoint(lastPoint.x, lastPoint.y),
                    new VRPPoint(route.points.last().x, route.points.last().y)
            ])
            for (int i = 1; i < drivePoint.points.size(); i++) {
                drivePoint.routeLength += RoutingDistanceUtil.calculateSimpleDistance(drivePoint.points[i - 1], drivePoint.points[i])
            }
            route.addToDrivePoints drivePoint
            route.routeLength = 0
            route.drivePoints.each {
                route.routeLength += it.routeLength
            }
        }
    }

    static double[][] calculateDistances(VRPProblem vrpProblem, String distanceType) {
        logInfo "Obliczanie odleglosci..."
        def methodName = "calculate${distanceType?.capitalize()}DistanceMatrix"
        return RoutingDistanceUtil."$methodName"(vrpProblem)
    }

    def calculateRoute(VRPSolution solution, String distanceType) {
        this.calculateRoadRoute(solution)
        solution.routeLength = 0
        solution.routes.each {
            solution.routeLength += it.routeLength
        }
    }
}