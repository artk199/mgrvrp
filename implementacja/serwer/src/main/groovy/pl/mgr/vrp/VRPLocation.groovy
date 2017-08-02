package pl.mgr.vrp

class VRPLocation {

    VRPLocation(){}
    VRPLocation(double x,double y){
        coordinates = new Coordinate(x:x,y:y)
    }
    long id
    Coordinate coordinates
}


