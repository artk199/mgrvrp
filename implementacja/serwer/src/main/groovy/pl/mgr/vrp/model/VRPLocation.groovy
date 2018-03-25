package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPLocation {

    VRPLocation() {}

    VRPLocation(double x, double y) {
        this.x = x
        this.y = y
    }

    int _ID //kolejny numer
    String name
    Double x
    Double y
}


