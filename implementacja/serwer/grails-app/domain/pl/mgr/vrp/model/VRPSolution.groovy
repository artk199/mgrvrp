package pl.mgr.vrp.model

import groovy.transform.AutoClone
import pl.mgr.vrp.ProblemWithSettings

@AutoClone
class VRPSolution {

    double routeLength
    String algorithm
    String distanceType
    Set<VRPRoute> routes = []
    Set<VRPAdditionalSetting> settings = []

    static hasMany = [routes: VRPRoute, settings: VRPAdditionalSetting]
    static belongsTo = [problem: VRPProblem]

    static VRPSolution createForProblemWithSettings(ProblemWithSettings problemWithSettings) {
        VRPSolution solution = new VRPSolution()
        solution.algorithm = problemWithSettings.algorithm
        solution.distanceType = problemWithSettings.distanceType
        solution.problem = problemWithSettings.problem
        problemWithSettings.additionalSettings.each {
            solution.addToSettings it
        }
        return solution
    }

}
