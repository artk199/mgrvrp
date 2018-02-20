package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPCustomer extends VRPLocation {

    Map restrictions
    double demand

}
