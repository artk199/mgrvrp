package mgrvrp.rest

import grails.transaction.Transactional
import groovy.util.logging.Slf4j
import pl.mgr.vrp.VRPProblem
import pl.mgr.vrp.VRPRoute
import pl.mgr.vrp.VRPService
import pl.mgr.vrp.VRPSingleRoute
import pl.mgr.vrp.VRPSolution

@Slf4j
class SavingsAlgorithmService extends VRPService  {

    VRPUtilService vrpUtilService

    @Override
    protected VRPSolution calculateSolution(VRPProblem problem) {
        VRPSolution solution = createInitialSolution(problem)
        logStep(solution)
        SavingsMatrix savingsMatrix = calculateSavings(problem)

        solution
    }

    SavingsMatrix calculateSavings(VRPProblem vrpProblem) {
        log.info "Calculate savings..."
    }

    private VRPSolution createInitialSolution(VRPProblem problem) {
        log.info "Creating initial solution..."
        VRPSolution solution = new VRPSolution()
        problem.customers.each {
            VRPRoute route = new VRPRoute()
            route.start = problem.depots[0]
            route.end = problem.depots[0]
            VRPSingleRoute singleRoute = new VRPSingleRoute()
            singleRoute.start = route.start
            singleRoute.end = route.end
            singleRoute.route += it
            route.route += singleRoute
            solution.routes += route
        }
        solution
    }

    class SavingsMatrix {

        double[][] savings

        SavingsMatrix(int size){
            savings = new double[size][size]
        }


    }
}
