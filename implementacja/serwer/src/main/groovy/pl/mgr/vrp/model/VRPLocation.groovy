package pl.mgr.vrp.model

class VRPLocation {

    VRPLocation() {}

    VRPLocation(double x, double y) {
        coordinates = new Coordinate(x: x, y: y)
    }
    long id
    Coordinate coordinates
}


