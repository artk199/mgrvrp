package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPLocation {

    VRPLocation() {}

    VRPLocation(double x, double y) {
        coordinates = new Coordinate(x: x, y: y)
    }

    int _ID //kolejny numer

    String id
    Coordinate coordinates
}


