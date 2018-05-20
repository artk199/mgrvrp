package pl.mgr.vrp.solvers

import com.google.ortools.constraintsolver.Assignment
import com.google.ortools.constraintsolver.FirstSolutionStrategy
import com.google.ortools.constraintsolver.IntVar
import com.google.ortools.constraintsolver.NodeEvaluator2
import com.google.ortools.constraintsolver.RoutingModel
import com.google.ortools.constraintsolver.RoutingSearchParameters
import com.google.ortools.linearsolver.MPSolver
import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPDepot
import pl.mgr.vrp.model.VRPPoint
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution
import pl.mgr.vrp.model.VRPCustomer

class GoogleORVRPSolverService extends VRPSolverService {

    private static MPSolver createSolver(String solverType) {
        return new MPSolver("my_program",
                MPSolver.OptimizationProblemType.valueOf(solverType));
    }

    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings, double[][] distances = null) {
        int vehicleCapacity = problemWithSettings.problem.capacity.toInteger()
        List<Pair<Double, Double>> locations = new ArrayList()
        List<Double> orderDemands = new ArrayList()
        if (!distances)
            distances = calculateDistances(problemWithSettings.problem, problemWithSettings.distanceType)
        VRPDepot depot = problemWithSettings.problem.depot
        locations.add(new Pair<Double, Double>(depot.x, depot.y))
        orderDemands.add(0)

        problemWithSettings.problem.customers.each { VRPCustomer customer ->
            locations.add(new Pair<Double, Double>(customer.x, customer.y))
            orderDemands.add(customer.demand)
        }

        int numberOfLocations = locations.size()
        int numberOfVehicles = numberOfLocations
        int numberOfOrders = numberOfLocations

        RoutingModel model = new RoutingModel(numberOfLocations, numberOfVehicles, 0);
        def parameters = RoutingModel.defaultSearchParameters()

        NodeEvaluator2 manhattanCostCallback = new NodeEvaluator2() {
            @Override
            public long run(int firstIndex, int secondIndex) {
                return (distances[firstIndex][secondIndex] * 100).toInteger()
            }
        };
        model.setArcCostEvaluatorOfAllVehicles(manhattanCostCallback)

        NodeEvaluator2 demandCallback = new NodeEvaluator2() {
            @Override
            public long run(int firstIndex, int secondIndex) {
                return orderDemands[firstIndex]
            }
        }
        model.addDimension(demandCallback, 0, vehicleCapacity, true, "capacity");

        def solution = model.solveWithParameters(parameters)

        def vrpSolution = VRPSolution.createForProblemWithSettings(problemWithSettings)

        if (solution != null) {
            String output = "Total cost: " + solution.objectiveValue() + "\n";
            // Dropped orders
            String dropped = "";
            for (int order = 0; order < numberOfOrders; ++order) {
                if (solution.value(model.nextVar(order)) == order) {
                    dropped += " " + order;
                }
            }
            if (dropped.length() > 0) {
                output += "Dropped orders:" + dropped + "\n";
            }
            // Routes
            for (int vehicle = 0; vehicle < numberOfVehicles; ++vehicle) {
                String route = "Vehicle " + vehicle + ": ";
                long order = model.start(vehicle);
                if (model.isEnd(solution.value(model.nextVar(order)))) {
                    route += "Empty";
                } else {
                    VRPRoute vrpRoute = new VRPRoute()
                    for (;
                            !model.isEnd(order);
                            order = solution.value(model.nextVar(order))) {
                        IntVar load = model.cumulVar(order, "capacity");
                        if (order <= numberOfOrders)
                            vrpRoute.points.add problemWithSettings.problem.customers[order.toInteger() - 1]
                        route += order + " Load(" + solution.value(load) + ") ";
                    }
                    IntVar load = model.cumulVar(order, "capacity");
                    route += order + " Load(" + solution.value(load) + ") ";
                    vrpSolution.routes.add vrpRoute
                }
            }
            println output
        }

        return vrpSolution
    }

}

// A pair class

class Pair<K, V> {
    final K first;
    final V second;

    public static <K, V> Pair<K, V> of(K element0, V element1) {
        return new Pair<K, V>(element0, element1);
    }

    public Pair(K element0, V element1) {
        this.first = element0;
        this.second = element1;
    }
}