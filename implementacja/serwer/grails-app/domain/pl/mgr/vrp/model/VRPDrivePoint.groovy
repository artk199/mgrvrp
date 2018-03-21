package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPDrivePoint {

    VRPDrivePoint() {}

    VRPDrivePoint(List<VRPPoint> points) {
        points.each { p ->
            this.addToPoints(p)
        }
    }

    List<VRPPoint> points = []

    double routeLength = 0
    static hasMany = [points: VRPPoint]
    static belongsTo = [route: VRPRoute]

}
