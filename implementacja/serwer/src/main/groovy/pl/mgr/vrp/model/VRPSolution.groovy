package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPSolution {

    List<VRPRoute> routes = []
    double routeLength
    Map settings

}
