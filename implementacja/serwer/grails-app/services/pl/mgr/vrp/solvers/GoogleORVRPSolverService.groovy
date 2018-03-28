package pl.mgr.vrp.solvers

import com.google.ortools.linearsolver.MPObjective
import com.google.ortools.linearsolver.MPSolver
import com.google.ortools.linearsolver.MPVariable
import grails.transaction.Transactional
import org.hibernate.collection.internal.PersistentMap

@Transactional
class GoogleORVRPSolverService {

    private static MPSolver createSolver(String solverType) {
        return new MPSolver("my_program",
                MPSolver.OptimizationProblemType.valueOf(solverType));
    }

    private static void runmy_program(String solverType,
                                      boolean printModel) {
        MPSolver solver = createSolver(solverType);
        MPVariable x = solver.makeNumVar(0.0, 1.0, "x");
        MPVariable y = solver.makeNumVar(0.0, 2.0, "y");
        MPObjective objective = solver.objective();
        objective.setCoefficient(y, 1);
        objective.setMaximization();
        solver.solve();
        System.out.println("Solution:");
        System.out.println("x = " + x.solutionValue());
        System.out.println("y = " + y.solutionValue());
    }

    public static void main(String[] args) throws Exception {
        runmy_program("GLOP_LINEAR_PROGRAMMING", false);
    }


    static void a() {
        /*
        routing = RoutingModel(num_locations, num_vehicles, depot)
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()


        dist_between_locations = CreateDistanceCallback(locations)
        dist_callback = dist_between_locations.Distance
        routing.SetArcCostEvaluatorOfAllVehicles(dist_callback)

        # PersistentMap.Put a callback to the demands.
                demands_at_locations = CreateDemandCallback(demands)
        demands_callback = demands_at_locations.Demand

        # Add a dimension for demand.
                slack_max = 0
        vehicle_capacity = 100
        fix_start_cumul_to_zero = True
        demand = "Demand"
        routing.AddDimension(demands_callback, slack_max, vehicle_capacity,
                fix_start_cumul_to_zero, demand)
                */
    }
}
