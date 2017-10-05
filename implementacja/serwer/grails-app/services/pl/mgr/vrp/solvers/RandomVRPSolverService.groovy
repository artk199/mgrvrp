package pl.mgr.vrp.solvers

import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution

class RandomVRPSolverService extends VRPSolverService{

    @Override
    protected VRPSolution calculateSolution(VRPProblem problem) {
        logInfo("Losuje rozwiązanie...")
        VRPSolution solution = new VRPSolution()
        List customers = problem.customers.collect()
        Collections.shuffle(customers)
        VRPRoute route = new VRPRoute()
        route.start = problem.depot
        route.end = problem.depot
        solution.routes += route
        while(customers.size() > 0){
            VRPCustomer customer = customers.pop()
            if(!validateCapacity(route,problem.maxCapacity - customer.demand)){
                route = new VRPRoute()
                route.start = problem.depot
                route.end = problem.depot
                solution.routes += route
            }
            route.points += customer
        }
        solution
    }

    boolean validateCapacity(VRPRoute route, double maxCapacity) {
        double sum = 0
        route.points.each {
            sum += it.demand
        }
        return sum <= maxCapacity
    }

}
