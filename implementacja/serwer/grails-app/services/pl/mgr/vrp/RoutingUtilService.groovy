package pl.mgr.vrp

import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPLocation
import pl.mgr.vrp.model.VRPProblem

class RoutingUtilService {

    private final double R = 6371.009

    GraphHopperOSMService graphHopperOSMService

    double[][] calculateAirDistanceMatrix(VRPProblem vrpProblem) {
        def distances = new double[vrpProblem.customers.size()+1][vrpProblem.customers.size()+1]
        vrpProblem.customers.eachWithIndex { VRPCustomer c, int i ->
            distances[i+1][0] = calculateDistanceForSphericalEarth(vrpProblem.depot,c)
            distances[0][i+1] = calculateDistanceForSphericalEarth(c,vrpProblem.depot)
            //Obliczamy n^2, a nie (n^2)/2 bo droga powrotna może mieć inna dlugosc
            vrpProblem.customers.eachWithIndex { VRPCustomer c2, int j ->
                distances[i+1][j+1] = calculateDistanceForSphericalEarth(c2,c)
            }
        }
        distances
    }

    double[][] calculateRoadDistanceMatrix(VRPProblem vrpProblem){
        def distances = new double[vrpProblem.customers.size()+1][vrpProblem.customers.size()+1]
        vrpProblem.customers.eachWithIndex { VRPCustomer c, int i ->
            distances[i+1][0] = calculateRoadDistance(vrpProblem.depot,c)
            distances[0][i+1] = calculateRoadDistance(c,vrpProblem.depot)
            //Obliczamy n^2, a nie (n^2)/2 bo droga powrotna może mieć inna dlugosc
            vrpProblem.customers.eachWithIndex { VRPCustomer c2, int j ->
                distances[i+1][j+1] = calculateRoadDistance(c2,c)
            }
        }
        distances
    }

    double[][] calculateSimpleDistanceMatrix(VRPProblem vrpProblem) {
        def distances = new double[vrpProblem.customers.size()+1][vrpProblem.customers.size()+1]
        vrpProblem.customers.eachWithIndex { VRPCustomer c, int i ->
            distances[i+1][0] = calculateSimpleDistance(vrpProblem.depot,c)
            distances[0][i+1] = calculateSimpleDistance(c,vrpProblem.depot)
            //Obliczamy n^2, a nie (n^2)/2 bo droga powrotna może mieć inna dlugosc
            vrpProblem.customers.eachWithIndex { VRPCustomer c2, int j ->
                distances[i+1][j+1] = calculateSimpleDistance(c2,c)
            }
        }
        distances
    }

    double  calculateRoadDistance(VRPLocation l1, VRPLocation l2){
        return graphHopperOSMService.calculateDistance(l1,l2)
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

    double calculateSimpleDistance(VRPLocation l1, VRPLocation l2){
        return Math.hypot(l1.coordinates.x - l2.coordinates.x, l1.coordinates.y - l2.coordinates.y)
    }

    double rad(double v) {
        return v * (Math.PI/180.0)
    }
}
