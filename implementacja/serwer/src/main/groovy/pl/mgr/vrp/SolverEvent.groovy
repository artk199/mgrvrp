package pl.mgr.vrp

import pl.mgr.vrp.model.VRPSolution

class SolverEvent {

    String message
    SolverEventType eventType = SolverEventType.MESSAGE
    VRPSolution solution

}
