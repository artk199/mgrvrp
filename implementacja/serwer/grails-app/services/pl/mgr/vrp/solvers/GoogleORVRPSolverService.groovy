package pl.mgr.vrp.solvers
/*
import com.google.ortools.constraintsolver.FirstSolutionStrategy
import com.google.ortools.constraintsolver.NodeEvaluator2
import com.google.ortools.constraintsolver.RoutingModel
import com.google.ortools.constraintsolver.RoutingSearchParameters
import com.google.ortools.linearsolver.MPSolver
*/
import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPDepot
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution
import pl.mgr.vrp.model.VRPCustomer

class GoogleORVRPSolverService extends VRPSolverService {
/*
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
        int numberOfOrders = numberOfLocations - 1

        RoutingModel model = new RoutingModel(numberOfLocations, numberOfVehicles, 0);
        RoutingSearchParameters parameters = RoutingSearchParameters.newBuilder()
                .mergeFrom(RoutingModel.defaultSearchParameters())
                .setFirstSolutionStrategy(FirstSolutionStrategy.Value.PATH_CHEAPEST_ARC)
                .build()
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
        model.addDimension(demandCallback, 0, vehicleCapacity, true, "capacity")

        def solution = model.solveWithParameters(parameters)

        def vrpSolution = VRPSolution.createForProblemWithSettings(problemWithSettings)

        if (solution != null) {
            for (int vehicle = 0; vehicle < numberOfVehicles; ++vehicle) {
                long order = model.start(vehicle);
                if (!model.isEnd(solution.value(model.nextVar(order)))) {
                    VRPRoute vrpRoute = new VRPRoute()
                    for (; !model.isEnd(order); order = solution.value(model.nextVar(order))) {
                        if (order <= numberOfOrders)
                            if (order != 0)
                                vrpRoute.points.add problemWithSettings.problem.customers[order.toInteger() - 1]
                    }
                    vrpSolution.routes.add vrpRoute
                }
            }
        }

        return vrpSolution
    }
*/

    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings, double[][] distances) {
        return null
    }
}


class Pair<K, V> {
    final K first;
    final V second;

    static <K, V> Pair<K, V> of(K element0, V element1) {
        return new Pair<K, V>(element0, element1);
    }

    Pair(K element0, V element1) {
        this.first = element0;
        this.second = element1;
    }
}