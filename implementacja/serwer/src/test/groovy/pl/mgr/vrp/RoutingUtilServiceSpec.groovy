package pl.mgr.vrp

import grails.test.mixin.TestFor
import pl.mgr.vrp.model.VRPLocation
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(RoutingUtilService)
class RoutingUtilServiceSpec extends Specification {

    def setup() {
    }

    def cleanup() {
    }

    void "calculate distance between two points"() {
        when:
            VRPLocation l1 = new VRPLocation(50.381457137270054,100.56775283813477)
            VRPLocation l2 = new VRPLocation(54.36375806691923,18.577537536621097)
            double sphericalDistance = service.calculateDistanceForSphericalEarth(l1,l2)
            double ellipsoidalDistance = service.calculateDistanceForEllipsoidalEarth(l1,l2)
        then:
        //sphericalDistance == 5252.15
        ellipsoidalDistance == 5252.15

    }
}
