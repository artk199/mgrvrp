package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPAlgorithm {
    String code
    String description
    List additionalSettings

    def findSetting(String name) {
        def found = additionalSettings?.find {
            it['code'] == name
        }
        return found['value']
    }
}
