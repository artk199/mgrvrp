package pl.mgr.vrp.solvers


import grails.transaction.Transactional

import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPDepot
import pl.mgr.vrp.model.VRPSolution
import pl.mgr.vrp.model.VRPCustomer

@Transactional
class GoogleORVRPSolverService extends VRPSolverService {

/*    static {
        System.loadLibrary("jniortools");
    }

    private static MPSolver createSolver(String solverType) {
        return new MPSolver("my_program",
                MPSolver.OptimizationProblemType.valueOf(solverType));
    }

    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings) {
        int vehicleCapacity = problemWithSettings.problem.capacity
        List<Pair<Double, Double>> locations = new ArrayList()
        List<Double> orderDemands = new ArrayList()
        int[] vehicleStarts = [0]
        int[] vehicleEnds = [0]
        double[][] distanceMatrix = this.calculateDistances(problemWithSettings.problem, problemWithSettings.distanceType)
        VRPDepot depot = problemWithSettings.problem.depot
        locations.add(new Pair<Double, Double>(depot.x, depot.y))
        orderDemands.add(0)

        problemWithSettings.problem.customers.each { VRPCustomer customer ->
            locations.add(new Pair<Double, Double>(customer.x, customer.y))
            orderDemands.add(customer.demand)
        }

        System.load("C:/Users/Artur/Downloads/A/lib/jniortools.dll")

        int numberOfLocations = locations.size()
        RoutingModel model = new RoutingModel(numberOfLocations, 5, 0)
        NodeEvaluator2 manhattanCostCallback = new NodeEvaluator2() {
            @Override
            long run(int firstIndex, int secondIndex) {
                return Double.valueOf(distanceMatrix[firstIndex][secondIndex] * 10000).toLong()
            }
        }
        model.setArcCostEvaluatorOfAllVehicles(manhattanCostCallback)

        NodeEvaluator2 demandCallback = new NodeEvaluator2() {
            @Override
            long run(int firstIndex, int secondIndex) {
                return orderDemands.get(firstIndex)
            }
        };
        model.addDimension(demandCallback, 0, vehicleCapacity, true, "demand")


        def res = model.solveWithParameters(RoutingModel.defaultSearchParameters())


        return null
    }
    */

    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings) {
        return null
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