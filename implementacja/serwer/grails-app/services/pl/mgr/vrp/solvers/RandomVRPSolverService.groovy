package pl.mgr.vrp.solvers

import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution

class RandomVRPSolverService extends VRPSolverService {

    @Override
    protected VRPSolution calculateSolution(VRPProblem problem) {
        VRPSolution best
        int MAX_ATTEMPTS = 1
        def attempts = problem.algorithm.findSetting('attempts')
        if (attempts) {
            MAX_ATTEMPTS = Integer.valueOf(attempts)
        }
        for (int i = 0; i < MAX_ATTEMPTS; i++) {
            logInfo("Randomizing solution #${i + 1}")
            VRPSolution solution = new VRPSolution()
            List customers = problem.customers.collect()
            Collections.shuffle(customers)
            VRPRoute route = new VRPRoute()
            route.start = problem.depot
            route.end = problem.depot
            solution.routes += route
            while (customers.size() > 0) {
                VRPCustomer customer = customers.pop()
                if (!validateCapacity(route, problem.maxCapacity - customer.demand)) {
                    route = new VRPRoute()
                    route.start = problem.depot
                    route.end = problem.depot
                    solution.routes += route
                }
                route.points += customer
            }
            this.calculateRoute(problem, solution)
            if (!best || best.routeLength > solution.routeLength) {
                this.logStep(solution)
                best = solution
            }
        }
        best

    }

    boolean validateCapacity(VRPRoute route, double maxCapacity) {
        double sum = 0
        route.points.each {
            sum += it.demand
        }
        return sum <= maxCapacity
    }

}
