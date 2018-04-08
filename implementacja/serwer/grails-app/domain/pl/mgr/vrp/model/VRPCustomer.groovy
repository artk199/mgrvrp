package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPCustomer extends VRPLocation {

    double demand
    static belongsTo = [problem: VRPProblem]

}
