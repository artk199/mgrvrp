package pl.mgr.vrp.model

import groovy.util.logging.Slf4j
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.solvers.GoogleORVRPSolverService
import pl.mgr.vrp.solvers.GreedyFirstVRPSolverService
import pl.mgr.vrp.solvers.JspritVRPSolverService
import pl.mgr.vrp.solvers.OptaPlannerVRPSolverService
import pl.mgr.vrp.solvers.SavingsVRPSolverService

@Slf4j
class VRPAlgorithm {

    public static String SAVINGS = 'savings'
    public static String JSPRIT = 'jsprit'
    public static String NN = 'greedy'
    public static String GOOGLE_OR = 'googleOR'
    public static String OPTA_PLANNER = 'optaPlanner'
    public static String TABU = 'tabu'

    static VRPSolverService getSolverService(String algorithm) {
        switch (algorithm) {
            case SAVINGS:
                return new SavingsVRPSolverService()
            case JSPRIT:
                return new JspritVRPSolverService()
            case NN:
                return new GreedyFirstVRPSolverService()
            case GOOGLE_OR:
                return new GoogleORVRPSolverService()
            case OPTA_PLANNER:
                return new OptaPlannerVRPSolverService()
            default:
                log.error "Unknown algorithm: ${algorithm}"
                return null
        }
    }
}
