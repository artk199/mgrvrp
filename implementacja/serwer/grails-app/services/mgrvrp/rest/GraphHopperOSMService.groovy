package mgrvrp.rest

import com.graphhopper.GHRequest
import com.graphhopper.GHResponse
import com.graphhopper.GraphHopper
import com.graphhopper.reader.osm.GraphHopperOSM
import com.graphhopper.routing.util.EncodingManager
import grails.transaction.Transactional
import pl.mgr.vrp.VRPLocation
import pl.mgr.vrp.VRPRoute
import pl.mgr.vrp.VRPSingleRoute

import javax.annotation.PostConstruct

class GraphHopperOSMService {

    GraphHopper graphHopper

    @PostConstruct
    void init() {
        graphHopper = new GraphHopperOSM().forServer()
        graphHopper.setDataReaderFile("C:\\tmp\\pomorskie-latest.osm.pbf")
        graphHopper.setGraphHopperLocation("C:\\tmp\\")
        graphHopper.setEncodingManager(new EncodingManager("car"))
        graphHopper.importOrLoad()
    }

    VRPSingleRoute calculateRoute(VRPLocation l1, VRPLocation l2){
        GHRequest request = new GHRequest(
                l1.coordinates.x,
                l1.coordinates.y,
                l2.coordinates.x, l2.coordinates.y
        )
        request.setWeighting("fastest")
        request.setVehicle("car")
        GHResponse route = graphHopper.route(request)
        if(route.hasErrors()){
            throw new RuntimeException("Route has errors!")
        }
        def best = route.getBest()
        VRPSingleRoute singleRoute = new VRPSingleRoute()
        singleRoute.start = l1
        singleRoute.end = l2
        best.points.each {
            VRPLocation location = new VRPLocation(it.lat,it.lon)
            singleRoute.route += location
        }
        return singleRoute
    }

}
