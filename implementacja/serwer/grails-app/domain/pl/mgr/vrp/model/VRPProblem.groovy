package pl.mgr.vrp.model

import groovy.json.internal.LazyMap

class VRPProblem {

    String paneType
    double capacity

    static hasMany = [
            depots   : VRPDepot,
            customers: VRPCustomer,
            solutions: VRPSolution
    ]

    static VRPProblem create(def params) {
        VRPProblem problem = new VRPProblem(params)
        problem.customers = problem.customers.collect {
            if (it instanceof LazyMap)
                return new VRPCustomer(it)
            it
        }
        problem.depots = problem.depots.collect {
            if (it instanceof LazyMap)
                return new VRPDepot(it)
            it
        }
        problem
    }

    VRPDepot getDepot() {
        return depots[0]
    }

}
