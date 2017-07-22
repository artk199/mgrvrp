package pl.mgr.vrp

import grails.validation.Validateable

class VRPProblem implements Validateable {

    List<VRPDepot> depots
    List<VRPCustomer> customers
    VRPFleet fleet
    Map properties

    static constraints = {
        depots nullable: false, size: 1..10000000
        customers nullable: false, size: 1..10000000
        fleet nullable: false
    }
}
