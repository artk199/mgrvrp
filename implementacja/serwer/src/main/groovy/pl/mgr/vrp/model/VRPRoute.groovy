package pl.mgr.vrp.model

class VRPRoute {

    VRPLocation start
    VRPLocation end
    List<VRPCustomer> points = []
    List<VRPDrivePoint> drivePoints = []
    double routeLength = 0

}
