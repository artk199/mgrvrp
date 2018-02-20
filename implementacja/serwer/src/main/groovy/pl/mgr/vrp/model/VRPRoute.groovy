package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPRoute {

    VRPLocation start
    VRPLocation end
    List<VRPCustomer> points = []
    List<VRPDrivePoint> drivePoints = []
    double routeLength = 0

}
