package pl.mgr.vrp

import com.graphhopper.GHRequest
import com.graphhopper.GHResponse
import com.graphhopper.GraphHopper
import com.graphhopper.PathWrapper
import com.graphhopper.reader.osm.GraphHopperOSM
import com.graphhopper.routing.util.EncodingManager
import com.graphhopper.util.Parameters
import grails.util.Holders
import groovy.util.logging.Slf4j
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPDrivePoint
import pl.mgr.vrp.model.VRPLocation
import pl.mgr.vrp.model.VRPPoint
import pl.mgr.vrp.model.VRPProblem

@Slf4j
class RoutingDistanceUtil {

    static private final double R = 6371.009

    static private GraphHopper graphHopper

    static void init() {
        initGraphHopper(Holders.config.get("mappath") as String, Holders.config.get("mappathtmp") as String)
    }

    static void initGraphHopper(String mapPath, String mapPathTmp) {
        graphHopper = new GraphHopperOSM().forServer()
        graphHopper.setDataReaderFile(mapPath)
        graphHopper.setGraphHopperLocation(mapPathTmp)
        //graphHopper.getCHFactoryDecorator().setDisablingAllowed(true)
        graphHopper.setEncodingManager(new EncodingManager("car"))
        graphHopper.importOrLoad()
    }

    static VRPDrivePoint calculateRoute(VRPLocation l1, VRPLocation l2) {
        PathWrapper best = getBestRoute(l1, l2)
        def result = []
        best.distance
        best.points.each {
            result += new VRPPoint(it.lat, it.lon)
        }
        VRPDrivePoint drivePoint = new VRPDrivePoint(result)
        drivePoint.routeLength = best.distance
        return drivePoint
    }

    static double calculateDistance(VRPLocation l1, VRPLocation l2) {
        getBestRoute(l1, l2).distance
    }

    static private PathWrapper getBestRoute(VRPLocation l1, VRPLocation l2) {
        GHRequest request = new GHRequest(
                l1.x,
                l1.y,
                l2.x, l2.y
        )
        request.setWeighting("fastest")
        request.setVehicle("car")
        request.getHints().put(Parameters.Routing.INSTRUCTIONS, false)
        GHResponse route = graphHopper.route(request)
        if (route.hasErrors()) {
            route.errors.each { err ->
                log.error err.message
            }
            throw new RuntimeException("Route has errors!")
        }
        def best = route.getBest()
        best
    }

    static double[][] calculateAirDistanceMatrix(VRPProblem vrpProblem) {
        def distances = new double[vrpProblem.customers.size() + 1][vrpProblem.customers.size() + 1]
        vrpProblem.customers.eachWithIndex { VRPCustomer c, int i ->
            distances[i + 1][0] = calculateDistanceForSphericalEarth(vrpProblem.depot, c)
            distances[0][i + 1] = calculateDistanceForSphericalEarth(c, vrpProblem.depot)
            //Obliczamy n^2, a nie (n^2)/2 bo droga powrotna może mieć inna dlugosc
            vrpProblem.customers.eachWithIndex { VRPCustomer c2, int j ->
                distances[i + 1][j + 1] = calculateDistanceForSphericalEarth(c2, c)
            }
        }
        distances
    }

    static double[][] calculateRoadDistanceMatrix(VRPProblem vrpProblem) {
        def distances = new double[vrpProblem.customers.size() + 1][vrpProblem.customers.size() + 1]
        vrpProblem.customers.eachWithIndex { VRPCustomer c, int i ->
            distances[i + 1][0] = calculateRoadDistance(c, vrpProblem.depot)
            distances[0][i + 1] = calculateRoadDistance(vrpProblem.depot, c)
            //Obliczamy n^2, a nie (n^2)/2 bo droga powrotna może mieć inna dlugosc
            vrpProblem.customers.eachWithIndex { VRPCustomer c2, int j ->
                distances[i + 1][j + 1] = calculateRoadDistance(c, c2)
            }
        }
        distances
    }

    static double[][] calculateSimpleDistanceMatrix(VRPProblem vrpProblem) {
        def distances = new double[vrpProblem.customers.size() + 1][vrpProblem.customers.size() + 1]
        vrpProblem.customers.eachWithIndex { VRPCustomer c, int i ->
            distances[i + 1][0] = calculateSimpleDistance(vrpProblem.depot, c)
            distances[0][i + 1] = calculateSimpleDistance(c, vrpProblem.depot)
            //Obliczamy n^2, a nie (n^2)/2 bo droga powrotna może mieć inna dlugosc
            vrpProblem.customers.eachWithIndex { VRPCustomer c2, int j ->
                distances[i + 1][j + 1] = calculateSimpleDistance(c2, c)
            }
        }
        distances
    }

    static double calculateRoadDistance(VRPLocation l1, VRPLocation l2) {
        return calculateDistance(l1, l2)
    }

    //Spherical Earth projected to a plane
    static double calculateDistanceForSphericalEarth(VRPLocation l1, VRPLocation l2) {
        double dLat = l1.x - l2.x
        double dLon = l1.y - l2.y
        double mLat = (l1.x + l2.x) / 2

        return R * Math.sqrt(Math.pow(rad(dLat), 2) + Math.pow(Math.cos(rad(mLat)) * rad(dLon), 2))
    }

    //Ellipsoidal Earth projected to a plane
    static double calculateDistanceForEllipsoidalEarth(VRPLocation l1, VRPLocation l2) {
        double dLat = l1.x - l2.x
        double dLon = l1.y - l2.y
        double mLat = (l1.x + l2.x) / 2

        double K1 = 111.13209 - 0.56605 * Math.cos(2 * rad(mLat)) + 0.00120 * Math.cos(4 * rad(mLat))
        double K2 = 111.41513 * Math.cos(rad(mLat)) - 0.09455 * Math.cos(3 * rad(mLat)) + 0.00012 * Math.cos(5 * rad(mLat))

        return Math.sqrt(Math.pow(K1 * dLat, 2) + Math.pow(K2 * dLon, 2))
    }

    static double calculateSimpleDistance(VRPLocation l1, VRPLocation l2) {
        return Math.hypot(l1.x - l2.x, l1.y - l2.y)
    }

    static double[][] calculateDistanceMatrix(ProblemWithSettings problem) {
        if (problem.distanceType == 'road')
            return calculateRoadDistanceMatrix(problem.problem)
        if (problem.distanceType == 'air')
            return calculateAirDistanceMatrix(problem.problem)
        return null
    }

    static double rad(double v) {
        return v * (Math.PI / 180.0)
    }
}
