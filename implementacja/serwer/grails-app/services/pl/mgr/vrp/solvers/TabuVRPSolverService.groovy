package pl.mgr.vrp.solvers

import groovy.json.JsonOutput
import groovy.util.logging.Slf4j
import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution

@Slf4j
class TabuVRPSolverService extends VRPSolverService {

    RandomVRPSolverService randomVRPSolverService

    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problem, double[][] distances = null) {

        int MAX_ITERATIONS = 100
        def iterationsSetting = problem.algorithm.findSetting('iterations')
        if (iterationsSetting) {
            MAX_ITERATIONS = iterationsSetting
            log.info "Ustawiona ilosc iteracji: $MAX_ITERATIONS"

        }
        assignIDs(problem)

        VRPSolution solution = randomVRPSolverService.calculateSolution(problem)
        VRPSolution opt = solution.clone()

        double[][] adjacentMatrix = routingUtilService.calculateAirDistanceMatrix(problem)

        logStep(solution)

        TabuBuffer tabuList = new TabuBuffer(5)

        int i = 0
        while (i < MAX_ITERATIONS) {
            i++
            log.info "Start iteracja {}", i

            //Szukamy zmiany pomiędzy krawędziami
            Swap swap = searchSwap(solution, adjacentMatrix, tabuList)
            if (swap == null) {
                log.info "Nie znalazłem zadnych swapów - koncze algorytm"
                break;
            }
            solution = applySwap(solution, swap)
            tabuList.insert(swap)
            calculateRoute(problem, solution)
            logStep(solution)
        }

        return solution
    }

    VRPSolution applySwap(VRPSolution solution, Swap swap) {
        VRPRoute route = solution.routes.get(swap.edge1.route)
        def i1 = route.points.findIndexOf { it._ID == swap.edge1.to }
        def i2 = route.points.findIndexOf { it._ID == swap.edge2.from }
        if (i1 == -1) {
            def tmp = route.points[i2]
            route.points.remove(i2)
            route.points.add(tmp)
        } else if (i2 == -1) {
            def tmp = route.points[i1]
            route.points.remove(i1)
            route.points.add(0, tmp)
        } else {
            def tmp = route.points[i1]
            route.points[i1] = route.points[i2]
            route.points[i2] = tmp
        }
        return solution
    }

    Swap searchSwap(VRPSolution solution, double[][] adjacentyMatrix, TabuBuffer tabuBuffer) {
        ArrayList<Edge> sortedEdges = getAllSortedEdges(solution, adjacentyMatrix)
        if (sortedEdges.size() < 4)
            return null
        Swap ret = null
        while (ret == null && !sortedEdges.empty) {
            Edge edge = sortedEdges.pop()
            Edge firstOppositeEdge = edge.nextEdge.nextEdge
            if (edge.length + firstOppositeEdge.length > adjacentyMatrix[edge.from][firstOppositeEdge.from] + adjacentyMatrix[edge.to][firstOppositeEdge.to]) {
                Swap candidate = new Swap(edge1: edge, edge2: firstOppositeEdge)
                if (!tabuBuffer.contains(candidate))
                    ret = candidate
            }
        }
        return ret
    }

    List<Neighbour> getNeighbours(int i, double[][] adjacentyMatrix) {
        List<Neighbour> neighbours = []
        for (int j = 1; j < adjacentyMatrix[i].length; j++) {
            neighbours.add new Neighbour(id: j, distance: adjacentyMatrix[i][j])
        }
        return neighbours.toSorted { a, b -> a.distance <=> b.distance }
    }

    private ArrayList<Edge> getAllSortedEdges(VRPSolution solution, double[][] adjacentyMatrix) {
        List<Edge> edges = []
        solution.routes.eachWithIndex { route, routeID ->
            //route.start = depot
            //route.points = customers
            int lastOne = 0 //Startujemy zawsze z depotu
            Edge lastEdge = null
            List<Edge> currentRouteEdges = []
            route.points.each { it ->
                Edge newEdge = new Edge(route: routeID, from: lastOne, to: it._ID, length: adjacentyMatrix[lastOne][it._ID])
                newEdge.previousEdge = lastEdge
                lastEdge?.nextEdge = newEdge
                lastEdge = newEdge
                currentRouteEdges.add newEdge
                lastOne = it._ID
            }
            Edge newEdge = new Edge(route: routeID, from: lastOne, to: route.start._ID, length: adjacentyMatrix[lastOne][route.start._ID])
            newEdge.previousEdge = lastEdge
            lastEdge.nextEdge = newEdge
            newEdge.nextEdge = currentRouteEdges.first()
            currentRouteEdges.add newEdge
            currentRouteEdges.first().previousEdge = newEdge

            edges.addAll(currentRouteEdges)
        }
        return edges.toSorted { a, b -> b.length <=> a.length }
    }

    class Swap {

        Edge edge1
        Edge edge2

        String getHash() {
            return "${edge1.from}-${edge1.to}-${edge2.from}-${edge2.to}"
        }

    }

    int searchRouteForCustomer(int customer, List<VRPRoute> routes) {
        for (int i = 0; i < routes.size(); i++) {
            for (int j = 0; j < routes[i].points.size(); j++) {
                if (routes[i].points[j]._ID == customer)
                    return i
            }
        }
        return -1
    }

    class Edge {

        int route
        int from
        int to
        double length
        Edge previousEdge
        Edge nextEdge

    }

    class Neighbour {
        int id
        double distance
    }

    class TabuBuffer {
        String[] tabuArr
        int size
        int currentIndex = 0

        TabuBuffer(int size) {
            tabuArr = new String[size]
            this.size = size
        }

        boolean contains(Swap s) {
            if (!s) return null
            tabuArr.any { s.hash == it }
        }

        void insert(Swap s) {
            currentIndex = (currentIndex + 1) % size
            tabuArr[currentIndex] = s.hash
        }
    }

    def prettyPrint(def cfg) {
        println JsonOutput.prettyPrint(JsonOutput.toJson(cfg))
    }

}