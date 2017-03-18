package mgrvrp.rest

import com.graphhopper.jsprit.core.problem.Location
import grails.converters.JSON
class VrpController{

    VrpService vrpService

    def index() {
        def json = request.JSON;
        println json.start;
        println json.depots;
        def start = Location.newInstance(json.start.x,json.start.y)
        def depots = []
        json.depots.each{
            depots.add(Location.newInstance(it.x,it.y))
        }
        def soulution = vrpService.calculateRoutes(start,depots)
        def routes = []
        soulution.routes.each { it ->
            def r = [:]
            r.start = [
                    x:it.start.location.coordinate.x,
                    y:it.start.location.coordinate.y
            ]
            r.end = [
                    x:it.end.location.coordinate.x,
                    y:it.end.location.coordinate.y
            ]
            r.route = []
            it.activities.each { activity ->
                r.route += [
                        x:activity.location.coordinate.x,
                        y:activity.location.coordinate.y
                ]
            }
            routes += r;
        }
        println "response ${routes}"
        render routes as JSON
    }
}
