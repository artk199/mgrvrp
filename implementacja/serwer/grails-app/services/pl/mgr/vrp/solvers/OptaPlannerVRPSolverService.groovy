package pl.mgr.vrp.solvers

import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPSolution

class OptaPlannerVRPSolverService  extends VRPSolverService{

    public static final String SOLVER_CONFIG = "org/optaplanner/examples/vehiclerouting/solver/vehicleRoutingSolverConfig.xml"

    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings, double[][] distances = null) {
        return null
    }
}
