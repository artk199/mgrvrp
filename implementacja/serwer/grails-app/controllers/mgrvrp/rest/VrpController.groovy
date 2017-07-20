package mgrvrp.rest

import com.graphhopper.jsprit.core.problem.Location
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution
import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate
import pl.mgr.vrp.VRPControllerException
import pl.mgr.vrp.VRPCustomer
import pl.mgr.vrp.VRPLocation
import pl.mgr.vrp.VRPProblem
import pl.mgr.vrp.VRPRoute
import pl.mgr.vrp.VRPSolution

@Slf4j
class VrpController{

    VrpService vrpService

    def index() {
        VRPProblem vrpProblem = new VRPProblem(request.JSON)
        validateVRPProblem(vrpProblem)

        def depot = Location.newInstance(vrpProblem.depots[0].coordinates.x,vrpProblem.depots[0].coordinates.y)
        List<Location> customers = []
        for (def c in vrpProblem.customers) {
            customers.add(Location.newInstance(c.coordinates.x, c.coordinates.y))
        }
        def solution = vrpService.calculateRoutes(depot,customers)
        VRPSolution s = translateSolution(solution)
        render s as JSON
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

    private VRPSolution translateSolution(VehicleRoutingProblemSolution s) {
        VRPSolution solution = new VRPSolution()
        s.routes.each { it ->
            VRPRoute r = new VRPRoute()
            r.start = new VRPLocation(
                    it.start.location.coordinate.x,
                    it.start.location.coordinate.y
            )
            r.end = new VRPLocation(
                    it.end.location.coordinate.x,
                    it.end.location.coordinate.y
            )
            r.route = []
            it.activities.each { activity ->
                r.route += new VRPLocation(
                        activity.location.coordinate.x,
                        activity.location.coordinate.y
                )
            }
            solution.routes += r
        }
        return solution
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
