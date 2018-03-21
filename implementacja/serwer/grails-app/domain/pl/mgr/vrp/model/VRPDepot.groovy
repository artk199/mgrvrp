package pl.mgr.vrp.model

class VRPDepot extends VRPLocation {
    static belongsTo = [problem: VRPProblem]
}
