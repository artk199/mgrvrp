package mgrvrp.rest

import com.graphhopper.jsprit.core.algorithm.VehicleRoutingAlgorithm
import com.graphhopper.jsprit.core.algorithm.box.Jsprit
import com.graphhopper.jsprit.core.problem.Location
import com.graphhopper.jsprit.core.problem.VehicleRoutingProblem
import com.graphhopper.jsprit.core.problem.job.Service
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl
import com.graphhopper.jsprit.core.problem.vehicle.VehicleType
import com.graphhopper.jsprit.core.problem.vehicle.VehicleTypeImpl
import com.graphhopper.jsprit.core.util.Solutions
import grails.transaction.Transactional
import pl.mgr.vrp.VRPLocation
import pl.mgr.vrp.VRPProblem
import pl.mgr.vrp.VRPRoute
import pl.mgr.vrp.VRPService
import pl.mgr.vrp.VRPSingleRoute
import pl.mgr.vrp.VRPSolution

@Transactional
class JspritVRPService extends VRPService {

    GraphHopperOSMService graphHopperOSMService

    private VehicleRoutingProblemSolution calculateRoutes(Location startLocation, List<Location> locations) {
        /*
         *  Define vehicle
         */
        //define index of weight capacity
        final int WEIGHT_INDEX = 0

        //define vehicle type with weight capacity 2
        VehicleTypeImpl.Builder vehicleTypeBuilder =
                VehicleTypeImpl.Builder.newInstance('vehicleType')
                        .addCapacityDimension(WEIGHT_INDEX, 5)
        VehicleType vehicleType = vehicleTypeBuilder.build()

        //define vehicle
        VehicleImpl.Builder vehicleBuilder = VehicleImpl.Builder.newInstance('vehicle')
        vehicleBuilder.setStartLocation(startLocation)
        vehicleBuilder.setType(vehicleType)
        VehicleImpl vehicle = vehicleBuilder.build()

        /*
         *  Define deliveries
         */
        List<Service> services = [];
        locations.eachWithIndex{ entry, i ->
            services += Service.Builder.newInstance("${i}")
                    .addSizeDimension(WEIGHT_INDEX, 1)
                    .setLocation(entry)
                    .build()
        }

        /*
         *  define a vehicle routing problem
         */
        VehicleRoutingProblem.Builder problemBuilder = VehicleRoutingProblem.Builder.newInstance()
        problemBuilder.addVehicle(vehicle)
        problemBuilder.addAllJobs(services)
        VehicleRoutingProblem problem = problemBuilder.build()

        /*
         * get the algorithm out-of-the-box
         */
        VehicleRoutingAlgorithm algorithm = Jsprit.createAlgorithm(problem)

        /*
         *  search a solution
         */
        Collection<VehicleRoutingProblemSolution> solutions = algorithm.searchSolutions()

        /*
         *  use the static helper-method to get the best solution
         */
        VehicleRoutingProblemSolution bestSolution = Solutions.bestOf(solutions)

        return bestSolution;
    }

    @Override
    protected VRPSolution caluculateSolution(VRPProblem problem) {
        def depot = Location.newInstance(problem.depots[0].coordinates.x,problem.depots[0].coordinates.y)
        List<Location> customers = []
        for (def c in problem.customers) {
            customers.add(Location.newInstance(c.coordinates.x, c.coordinates.y))
        }
        def solution = calculateRoutes(depot,customers)
        return translateSolution(solution)
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
            def lastLocation = r.start
            it.activities.each { activity ->
                VRPLocation location = new VRPLocation(
                        activity.location.coordinate.x,
                        activity.location.coordinate.y
                )
                VRPSingleRoute route = new VRPSingleRoute(start:lastLocation,end:location)
                r.route += route
                lastLocation = location
            }
            r.route += new VRPSingleRoute(start:lastLocation,end:r.end)
            solution.routes += r
        }
        logStep(solution)
        solution.routes.each {

            it.route.each { r ->
                r.route = graphHopperOSMService.calculateRoute(r.start,r.end).route
                sleep(100)
                logStep(solution)
            }

        }

        return solution
    }
}
