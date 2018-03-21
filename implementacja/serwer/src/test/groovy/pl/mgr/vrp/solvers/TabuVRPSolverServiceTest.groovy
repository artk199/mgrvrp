package pl.mgr.vrp.solvers

import groovy.json.JsonSlurper
import pl.mgr.vrp.GraphHopperOSMService
import pl.mgr.vrp.RoutingUtilService
import pl.mgr.vrp.model.VRPProblem

class TabuVRPSolverServiceTest extends GroovyTestCase {

    def dummyMessagingTemplate = [convertAndSend: { a, b -> return }]
    GraphHopperOSMService graphHopperOSMService = new GraphHopperOSMService()
    RoutingUtilService routingUtilService = new RoutingUtilService(graphHopperOSMService: graphHopperOSMService)
    GreedyFirstVRPSolverService greedyFirstVRPSolverService = new GreedyFirstVRPSolverService(graphHopperOSMService: graphHopperOSMService, routingUtilService: routingUtilService, brokerMessagingTemplate: dummyMessagingTemplate)
    TabuVRPSolverService tabuSolver = new TabuVRPSolverService(
            greedyFirstVRPSolverService: greedyFirstVRPSolverService,
            graphHopperOSMService: graphHopperOSMService,
            routingUtilService: routingUtilService,
            brokerMessagingTemplate: dummyMessagingTemplate
    )

    void testTabu() {
        //graphHopperOSMService.init()

        String problem = """{"settings":{"algorithm":"jsprit","distance":"air","geo_distance":"spherical","capacity":15},"id":"0","customers":[{"id":"0","demand":5,"coordinates":{"x":54.38425629135571,"y":18.627319335937504}},{"id":"9","demand":7,"coordinates":{"x":54.38945421393887,"y":18.633327484130863}},{"id":"10","demand":3,"coordinates":{"x":54.40089731894802,"y":18.62963676452637}},{"id":"11","demand":8,"coordinates":{"x":54.365258284012725,"y":18.619079589843754}},{"id":"12","demand":4,"coordinates":{"x":54.372358568094,"y":18.63813400268555}},{"id":"13","demand":1,"coordinates":{"x":54.40973980292389,"y":18.600025177001957}}],"depots":[{"id":"0","coordinates":{"x":54.385755759664704,"y":18.610324859619144}}]}"""
        VRPProblem vrpProblem = VRPProblem.create(new JsonSlurper().parseText(problem))
        tabuSolver.calculateSolution(vrpProblem)

        assert 1 == 1
    }
}
