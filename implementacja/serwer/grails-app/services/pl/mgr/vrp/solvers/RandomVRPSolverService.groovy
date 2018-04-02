package pl.mgr.vrp.solvers

import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileStatic
import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution

@CompileStatic
class RandomVRPSolverService extends VRPSolverService {

    private static String ATTEPTS_SETTING_KEY = "attempts"


    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings) {
        VRPSolution best
        int MAX_ATTEMPTS = 1
        def attempts = problemWithSettings.getSetting(ATTEPTS_SETTING_KEY)
        if (attempts) {
            MAX_ATTEMPTS = Integer.valueOf(attempts)
        }
        for (int i = 0; i < MAX_ATTEMPTS; i++) {
            logInfo("Randomizing solution #${i + 1}")
            VRPSolution solution = VRPSolution.createForProblemWithSettings(problemWithSettings)
            List<VRPCustomer> customers = problemWithSettings.problem.customers.collect()
            Collections.shuffle(customers)
            VRPRoute route = new VRPRoute()
            solution.addToRoutes route
            while (customers.size() > 0) {
                VRPCustomer customer = customers.pop()
                if (!validateCapacity(route, problemWithSettings.problem.capacity - customer.demand)) {
                    route = new VRPRoute()
                    solution.addToRoutes route
                }
                route.addToPoints customer
            }
            this.calculateRoute(solution, problemWithSettings.distanceType)
            if (!best || best.routeLength > solution.routeLength) {
                this.logStep(problemWithSettings.subscriber, solution)
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
