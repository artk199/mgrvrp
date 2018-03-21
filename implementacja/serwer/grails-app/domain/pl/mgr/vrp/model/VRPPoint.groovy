package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPPoint extends VRPLocation {

    VRPPoint() {}

    VRPPoint(double x, double y) {
        super(x, y)
        this.name = "point"
    }

    static belongsTo = [drivePoint: VRPDrivePoint]

}
