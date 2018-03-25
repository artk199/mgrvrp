package pl.mgr.vrp

import pl.mgr.vrp.model.VRPAdditionalSetting
import pl.mgr.vrp.model.VRPProblem

class ProblemWithSettings {

    VRPProblem problem

    String algorithm
    String distanceType

    List<VRPAdditionalSetting> additionalSettings

    String getSetting(String code) {
        return additionalSettings.find { it.code == code }?.value
    }

}
