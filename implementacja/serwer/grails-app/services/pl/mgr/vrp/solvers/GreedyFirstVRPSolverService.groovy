package pl.mgr.vrp.solvers

import grails.transaction.Transactional
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution

@Transactional
class GreedyFirstVRPSolverService extends RandomVRPSolverService {

    @Override
    protected VRPSolution calculateSolution(VRPProblem problem) {
        VRPSolution solution = new VRPSolution();
        def allCustomers = []
        problem.customers.eachWithIndex { it, i ->
            allCustomers.push([id: i, demand: it.demand])
        }

        def leftCustomers = allCustomers.toSorted { a, b -> (a.demand <=> b.demand) * -1 }

        def adjacentMatrix = routingUtilService.calculateAirDistanceMatrix(problem)
        println adjacentMatrix
        while (leftCustomers.size() > 0) {

            VRPRoute route = new VRPRoute()
            route.start = problem.depot
            route.end = problem.depot

            def customer = leftCustomers.pop()

            route.points.push(problem.customers[customer.id])

            double leftDemand = problem.maxCapacity
            def nearestNeighbour = 0
            while (nearestNeighbour != -1) {
                nearestNeighbour = findNearestNeighbour(adjacentMatrix, customer.id, leftDemand, leftCustomers)
                if (nearestNeighbour != -1) {
                    leftCustomers.removeAll { it.id == nearestNeighbour }
                    leftDemand -= problem.customers[nearestNeighbour].demand
                    route.points.push(problem.customers[nearestNeighbour])
                }
            }
            solution.routes.add(route)
        }
        return solution
    }

    def findNearestNeighbour(def adjacencyMatrix, def id, def leftDemand, def leftCustomers) {
        //TODO: Nie wiem czy [i][j] czy [j][i]...
        int min = Double.MAX_VALUE
        int result = -1
        leftCustomers.each { customer ->
            if (min > adjacencyMatrix[id + 1][customer.id + 1] && customer.demand <= leftDemand) {
                min = adjacencyMatrix[id + 1][customer.id + 1]
                result = customer.id
            }
        }
        return result
    }
}
