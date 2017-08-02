package mgrvrp.rest

import grails.transaction.Transactional
import pl.mgr.vrp.VRPLocation
import pl.mgr.vrp.VRPProblem

@Transactional
class VRPUtilService {

    private final double R = 6371.009

    void calculateAirDistanceMatrix(VRPProblem problem) {

    }

    double[][] calculateDrivingDistanceMatrix(){

    }

    //Spherical Earth projected to a plane
    double calculateDistanceForSphericalEarth(VRPLocation l1, VRPLocation l2){
        double dLat = l1.coordinates.x - l2.coordinates.x
        double dLon = l1.coordinates.y - l2.coordinates.y
        double mLat = (l1.coordinates.x+l2.coordinates.x)/2

        return R * Math.sqrt(Math.pow(rad(dLat),2)+Math.pow(Math.cos(rad(mLat))*rad(dLon),2))
    }

    //Ellipsoidal Earth projected to a plane
    double calculateDistanceForEllipsoidalEarth(VRPLocation l1, VRPLocation l2){
        double dLat = l1.coordinates.x - l2.coordinates.x
        double dLon = l1.coordinates.y - l2.coordinates.y
        double mLat = (l1.coordinates.x+l2.coordinates.x)/2

        double K1 = 111.13209 - 0.56605 * Math.cos(2*rad(mLat)) + 0.00120*Math.cos(4*rad(mLat))
        double K2 = 111.41513 * Math.cos(rad(mLat)) - 0.09455*Math.cos(3*rad(mLat)) + 0.00012*Math.cos(5*rad(mLat))

        return Math.sqrt(Math.pow(K1*dLat,2)+Math.pow(K2*dLon,2))
    }

    double rad(double v) {
        return v * (Math.PI/180.0)
    }
}
