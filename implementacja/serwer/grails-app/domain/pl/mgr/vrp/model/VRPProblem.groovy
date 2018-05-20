package pl.mgr.vrp.model

import groovy.json.internal.LazyMap
import pl.mgr.vrp.User

class VRPProblem {

    String paneType
    User owner
    Set<VRPCustomer> customers
    Set<VRPSolution> solutions
    Set<VRPDepot> depots

    double capacity

    static hasMany = [
            depots   : VRPDepot,
            customers: VRPCustomer,
            solutions: VRPSolution
    ]

    VRPDepot getDepot() {
        return depots.first()
    }

}
