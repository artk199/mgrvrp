package pl.mgr.vrp.solvers

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
import pl.mgr.vrp.GraphHopperOSMService
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPLocation
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPPoint
import pl.mgr.vrp.model.VRPSolution

@Transactional
class JspritVRPSolverService extends VRPSolverService {

    final int WEIGHT_INDEX = 0
    GraphHopperOSMService graphHopperOSMService

    private VehicleRoutingProblemSolution calculateRoutes(Location startLocation, List<Service> services, double maxCapacity) {

        VehicleTypeImpl.Builder vehicleTypeBuilder =
                VehicleTypeImpl.Builder.newInstance('vehicleType')
                        .addCapacityDimension(WEIGHT_INDEX, (int)maxCapacity)
        VehicleType vehicleType = vehicleTypeBuilder.build()

        VehicleImpl.Builder vehicleBuilder = VehicleImpl.Builder.newInstance('vehicle')
        vehicleBuilder.setStartLocation(startLocation)
        vehicleBuilder.setType(vehicleType)
        VehicleImpl vehicle = vehicleBuilder.build()

        VehicleRoutingProblem.Builder problemBuilder = VehicleRoutingProblem.Builder.newInstance()
        problemBuilder.addVehicle(vehicle)
        problemBuilder.addAllJobs(services)
        VehicleRoutingProblem problem = problemBuilder.build()

        VehicleRoutingAlgorithm algorithm = Jsprit.createAlgorithm(problem)
        Collection<VehicleRoutingProblemSolution> solutions = algorithm.searchSolutions()
        VehicleRoutingProblemSolution bestSolution = Solutions.bestOf(solutions)

        return bestSolution
    }

    @Override
    protected VRPSolution calculateSolution(VRPProblem problem) {
        def depot = Location.newInstance(problem.depots[0].coordinates.x,problem.depots[0].coordinates.y)

        List<Service> services = []
        for (def c in problem.customers) {
            services += Service.Builder.newInstance("${c.id}")
                    .addSizeDimension(WEIGHT_INDEX, (int)c.demand)
                    .setLocation(Location.newInstance(c.coordinates.x, c.coordinates.y))
                    .build()
        }

        def solution = calculateRoutes(depot,services,problem.maxCapacity)
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
            r.points = []
            it.activities.each { activity ->
                VRPPoint point = new VRPPoint(
                        activity.location.coordinate.x,
                        activity.location.coordinate.y
                )
                r.points += point
            }
            solution.routes += r
        }
        return solution
    }
}
