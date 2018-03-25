package pl.mgr.vrp.solvers

import groovy.transform.CompileStatic
import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution

@CompileStatic
class GreedyFirstVRPSolverService extends VRPSolverService {

    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings) {
        VRPSolution solution = VRPSolution.createForProblemWithSettings(problemWithSettings)
        VRPProblem problem = problemWithSettings.problem
        this.assignIDs(problem)
        List<VRPCustomer> allCustomers = problem.customers.collect()

        List<VRPCustomer> leftCustomers = allCustomers.toSorted { a, b -> (a.demand <=> b.demand) * -1 }

        def adjacentMatrix = routingUtilService.calculateAirDistanceMatrix(problem)

        while (leftCustomers.size() > 0) {

            VRPRoute route = new VRPRoute()
            VRPCustomer customer = leftCustomers.pop()

            route.addToPoints customer

            double leftDemand = problem.capacity - customer.demand

            VRPCustomer nearestNeighbour = null
            boolean stop = false
            while (!stop) {
                nearestNeighbour = findNearestNeighbour(adjacentMatrix, customer._ID, leftDemand, leftCustomers)
                if (nearestNeighbour != null) {
                    leftCustomers.removeAll { it == nearestNeighbour }
                    leftDemand -= nearestNeighbour.demand
                    route.addToPoints nearestNeighbour
                } else {
                    stop = true
                }
            }
            solution.addToRoutes route
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
