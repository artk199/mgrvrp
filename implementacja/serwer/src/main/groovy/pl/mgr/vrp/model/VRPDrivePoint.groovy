package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPDrivePoint {

    VRPDrivePoint(VRPLocation from, VRPLocation dest, List<VRPPoint> points) {
        this.from = from
        this.destination = dest
        this.points = points
    }

    VRPLocation from
    VRPLocation destination
    List<VRPPoint> points = []
    double routeLength = 0

}
