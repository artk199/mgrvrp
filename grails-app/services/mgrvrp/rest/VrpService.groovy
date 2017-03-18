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

@Transactional
class VrpService {

    VehicleRoutingProblemSolution calculateRoutes(Location startLocation,List<Location> locations) {
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
}
