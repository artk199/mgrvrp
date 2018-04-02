package pl.mgr.vrp

import pl.mgr.vrp.model.VRPAdditionalSetting
import pl.mgr.vrp.model.VRPProblem
import rx.Subscriber

class ProblemWithSettings {

    VRPProblem problem

    String algorithm
    String distanceType

    List<VRPAdditionalSetting> additionalSettings

    Subscriber<SolverEvent> subscriber

    String getSetting(String code) {
        return additionalSettings.find { it.code == code }?.value
    }

}
