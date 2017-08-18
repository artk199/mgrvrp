package mgrvrp.rest

import com.graphhopper.GHRequest
import com.graphhopper.GHResponse
import com.graphhopper.GraphHopper
import com.graphhopper.reader.osm.GraphHopperOSM
import com.graphhopper.routing.util.EncodingManager
import pl.mgr.vrp.model.VRPLocation
import pl.mgr.vrp.model.VRPPoint

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

    List<VRPPoint> calculateRoute(VRPLocation l1, VRPLocation l2){
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
        def result = []
        best.points.each {
            result += new VRPPoint(it.lat,it.lon)
        }
        return result
    }

}
