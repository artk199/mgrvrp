package pl.mgr.vrp.solvers

import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution

class GreedyFirstVRPSolverService extends VRPSolverService {

    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings, double[][] distances = null) {
        VRPSolution solution = VRPSolution.createForProblemWithSettings(problemWithSettings)
        VRPProblem problem = problemWithSettings.problem

        List<VRPCustomer> allCustomers = problem.customers.collect()
        List<VRPCustomer> leftCustomers = allCustomers.toSorted { a, b -> (a.demand <=> b.demand) * -1 }

        assignIDs(problem)
        def adjacentMatrix = calculateDistances(problem, problemWithSettings.distanceType)

        while (leftCustomers.size() > 0) {

            VRPRoute route = new VRPRoute()

            VRPCustomer customer = findNearestNeighbour(adjacentMatrix, 0 /* depot */, problem.capacity, leftCustomers)
            leftCustomers.removeAll { it == customer }

            route.points.add customer

            double leftDemand = problem.capacity - customer.demand

            VRPCustomer nearestNeighbour = null
            boolean stop = false
            while (!stop) {
                nearestNeighbour = findNearestNeighbour(adjacentMatrix, nearestNeighbour ? nearestNeighbour._ID : customer._ID, leftDemand, leftCustomers)
                if (nearestNeighbour != null) {
                    leftCustomers.removeAll { it == nearestNeighbour }
                    leftDemand -= nearestNeighbour.demand
                    route.points.add nearestNeighbour
                } else {
                    stop = true
                }
            }
            solution.routes.add route
        }
        return solution
    }

    VRPCustomer findNearestNeighbour(double[][] adjacencyMatrix, int id, double leftDemand, List<VRPCustomer> leftCustomers) {
        double min = Double.MAX_VALUE
        VRPCustomer result = null
        leftCustomers.each { customer ->
            if (min > adjacencyMatrix[id][customer._ID] && customer.demand <= leftDemand) {
                min = adjacencyMatrix[id][customer._ID]
                result = customer
            }
        }
        return result
    }
}
