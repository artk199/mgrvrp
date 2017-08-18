package pl.mgr.vrp.model

import grails.validation.Validateable
import groovy.json.internal.LazyMap

class VRPProblem implements Validateable {

    List<VRPDepot> depots
    List<VRPCustomer> customers
    double maxCapacity
    VRPFleet fleet

    static VRPProblem create(def params) {
        VRPProblem problem = new VRPProblem(params)
        problem.customers = problem.customers.collect {
            if(it instanceof LazyMap)
                return new VRPCustomer(it)
            it
        }
        problem
    }

    VRPDepot getDepot(){
        return depots[0]
    }

    static constraints = {
        depots nullable: false, size: 1..10000000
        customers nullable: false, size: 1..10000000
        //TODO://Dodac walidator maxCap vs customers
        fleet nullable: false
    }
}
