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

        List<VRPCustomer> allCustomers = problem.customers.collect()
        List<VRPCustomer> leftCustomers = allCustomers.toSorted { a, b -> (a.demand <=> b.demand) * -1 }

        this.assignIDs(problem)
        def adjacentMatrix = this.calculateDistances(problem, problemWithSettings.distanceType)

        while (leftCustomers.size() > 0) {

            VRPRoute route = new VRPRoute()

            VRPCustomer customer = findNearestNeighbour(adjacentMatrix, 0 /* depot */, problem.capacity, leftCustomers)
            leftCustomers.removeAll { it == customer }

            route.addToPoints customer

            double leftDemand = problem.capacity - customer.demand

            VRPCustomer nearestNeighbour = null
            boolean stop = false
            while (!stop) {
                nearestNeighbour = findNearestNeighbour(adjacentMatrix, nearestNeighbour ? nearestNeighbour._ID : customer._ID, leftDemand, leftCustomers)
                if (nearestNeighbour != null) {
                    leftCustomers.removeAll { it == nearestNeighbour }
                    leftDemand -= nearestNeighbour.demand
                    route.addToPoints nearestNeighbour
                } else {
                    stop = true
                }
            }
            solution.addToRoutes route
            this.logStep(solution)
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
