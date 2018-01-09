package pl.mgr.vrp.solvers

import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPSolution

class TabuVRPSolverService extends RandomVRPSolverService {

    @Override
    protected VRPSolution calculateSolution(VRPProblem problem) {
        VRPSolution solution = super.calculateSolution(problem)
        def demands = []
        def adjacentMatrix = routingUtilService.calculateAirDistanceMatrix(problem)
        println adjacentMatrix
        
    }

}