package pl.mgr.vrp

import grails.converters.JSON
import pl.mgr.vrp.model.VRPSolution

class SolverEvent {

    String message
    SolverEventType eventType = SolverEventType.MESSAGE
    VRPSolution solution

    JSON toJson() {
        def json = null
        JSON.use('deep') {
            json = this as JSON
        }
        return json
    }
}
