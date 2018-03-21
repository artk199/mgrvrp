package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPSolution {

    double routeLength
    String algorithm
    String distanceType
    Set<VRPRoute> routes = []
    Set<VRPAdditionalSetting> settings = []

    static hasMany = [routes: VRPRoute, settings: VRPAdditionalSetting]
    static belongsTo = [problem: VRPProblem]

}
