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
import com.graphhopper.jsprit.core.util.Coordinate
import com.graphhopper.jsprit.core.util.VehicleRoutingTransportCostsMatrix
import com.graphhopper.jsprit.core.problem.cost.VehicleRoutingTransportCosts
import com.graphhopper.jsprit.core.util.Solutions
import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPDrivePoint
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPPoint
import pl.mgr.vrp.model.VRPSolution

class JspritVRPSolverService extends VRPSolverService {

    final int WEIGHT_INDEX = 0

    private VehicleRoutingProblemSolution calculateRoutes(Location startLocation, List<Service> services, double maxCapacity, VehicleRoutingTransportCosts distanceMatrix) {

        VehicleTypeImpl.Builder vehicleTypeBuilder =
                VehicleTypeImpl.Builder.newInstance('vehicleType')
                        .addCapacityDimension(WEIGHT_INDEX, (int) maxCapacity)
        VehicleType vehicleType = vehicleTypeBuilder.build()

        VehicleImpl.Builder vehicleBuilder = VehicleImpl.Builder.newInstance('vehicle')
        vehicleBuilder.setStartLocation(startLocation)
        vehicleBuilder.setType(vehicleType)
        VehicleImpl vehicle = vehicleBuilder.build()

        VehicleRoutingProblem.Builder problemBuilder = VehicleRoutingProblem.Builder.newInstance()
        problemBuilder.addVehicle(vehicle)
        problemBuilder.addAllJobs(services)
        problemBuilder.setRoutingCost(distanceMatrix)
        VehicleRoutingProblem problem = problemBuilder.build()

        VehicleRoutingAlgorithm algorithm = Jsprit.createAlgorithm(problem)
        algorithm.setMaxIterations(10)
        Collection<VehicleRoutingProblemSolution> solutions = algorithm.searchSolutions()
        VehicleRoutingProblemSolution bestSolution = Solutions.bestOf(solutions)

        return bestSolution
    }

    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings, double[][] distances = null) {
        logInfo("Searching for solution...")
        VRPProblem problem = problemWithSettings.problem

        def depot = Location.Builder.newInstance().setCoordinate(Coordinate.newInstance(problem.depot.x, problem.depot.y)).setId("depot").build()

        List<Service> services = []
        for (def c in problem.customers) {
            Location l = Location.Builder.newInstance().setId(c.name).setCoordinate(Coordinate.newInstance(c.x, c.y)).build()
            services += Service.Builder.newInstance("${c.name}")
                    .addSizeDimension(WEIGHT_INDEX, (int) c.demand)
                    .setLocation(l)
                    .build()
        }

        VehicleRoutingTransportCosts matrix = createDistanceMatrix(problemWithSettings, distances)
        def solution = calculateRoutes(depot, services, problemWithSettings.problem.capacity, matrix)

        return translateSolution(solution, problemWithSettings)
    }

    VehicleRoutingTransportCosts createDistanceMatrix(ProblemWithSettings problemWithSettings, double[][] distanceMatrix) {
        VehicleRoutingTransportCostsMatrix.Builder costMatrixBuilder = VehicleRoutingTransportCostsMatrix.Builder.newInstance(false)
        if (!distanceMatrix)
            distanceMatrix = calculateDistances(problemWithSettings.problem, problemWithSettings.distanceType)
        problemWithSettings.problem.customers.eachWithIndex { VRPCustomer c1, int i ->
            costMatrixBuilder.addTransportDistance(c1.name, "depot", distanceMatrix[i + 1][0])
            costMatrixBuilder.addTransportDistance("depot", c1.name, distanceMatrix[0][i + 1])
            problemWithSettings.problem.customers.eachWithIndex { VRPCustomer c2, int j ->
                costMatrixBuilder.addTransportDistance(c1.name, c2.name, distanceMatrix[i + 1][j + 1])
            }
        }

        VehicleRoutingTransportCosts costMatrix = costMatrixBuilder.build();
        costMatrix
    }

    private
    static VRPSolution translateSolution(VehicleRoutingProblemSolution s, ProblemWithSettings problemWithSettings) {
        VRPSolution solution = VRPSolution.createForProblemWithSettings(problemWithSettings)
        s.routes.each { it ->
            VRPRoute r = new VRPRoute()
            def points = []
            points += new VRPPoint(it.start.location.coordinate.x, it.start.location.coordinate.y)
            it.activities.each { activity ->
                VRPPoint point = new VRPPoint(
                        activity.location.coordinate.x,
                        activity.location.coordinate.y
                )
                r.points.add(new VRPCustomer(x: activity.location.coordinate.x, y: activity.location.coordinate.y))
                points += point
            }
            points += new VRPPoint(it.end.location.coordinate.x, it.end.location.coordinate.y)
            r.drivePoints.add new VRPDrivePoint(points)
            solution.routes.add r
        }
        return solution
    }
}
