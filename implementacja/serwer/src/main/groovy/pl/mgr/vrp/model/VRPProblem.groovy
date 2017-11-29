package pl.mgr.vrp.model

import grails.validation.Validateable
import groovy.json.internal.LazyMap

class VRPProblem implements Validateable {

    List<VRPDepot> depots
    List<VRPCustomer> customers
    Map settings

    static VRPProblem create(def params) {
        VRPProblem problem = new VRPProblem(params)
        problem.customers = problem.customers.collect {
            if (it instanceof LazyMap)
                return new VRPCustomer(it)
            it
        }
        problem
    }

    VRPDepot getDepot() {
        return depots[0]
    }

    double getMaxCapacity() {
        return settings['capacity'] ?: Double.MAX_VALUE
    }

    String getDistanceType() {
        return settings['distance'] ?: 'air'
    }

    static constraints = {
        depots nullable: false, size: 1..10000000
        customers nullable: false, size: 1..10000000
    }


}
