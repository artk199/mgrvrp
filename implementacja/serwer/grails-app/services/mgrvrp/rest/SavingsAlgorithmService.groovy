package mgrvrp.rest

import groovy.json.JsonOutput
import groovy.transform.ToString
import groovy.util.logging.Slf4j
import pl.mgr.vrp.VRPService
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution

@Slf4j
class SavingsAlgorithmService extends VRPService  {

    RoutingUtilService routingUtilService

    @Override
    protected VRPSolution calculateSolution(VRPProblem problem) {
        VRPSolution solution = createInitialSolution(problem)
        calculateNormalRoute(solution)
        logStep(solution)
        double[][] distances = calculateDistances(problem)
        List<Saving> savings = calculateSavings(distances)
        createRoutes(solution,savings,problem)
        solution
    }

    VRPSolution createRoutes(VRPSolution solution, List<Saving> savings,VRPProblem problem) {
        logInfo "Obliczanie tras..."
        //solution.routes = []
        savings.each { saving ->

            VRPCustomer customer1 = problem.customers[saving.i-1]
            VRPCustomer customer2 = problem.customers[saving.j-1]

            def rI = findRoute(solution.routes,customer1)
            def rJ = findRoute(solution.routes,customer2)

            if(!rI && !rJ){
                //Jeżeli żaden z punktów (i,j) nie został dodany do ścieżki to tworzymy nową zawierającą i oraz j
                solution.routes += createRoute(problem.depot,problem.depot,customer1,customer2)
                log.info "Tworzenie nowej trasy..."
            }else if(!rI && !isInner(rJ, customer2)){
                log.info "Dodawanie do drugiej trasy..."
                addCustomerToRoute(rJ,customer2,customer1)
            }else if(!rJ && !isInner(rI, customer1)){
                log.info "Dodawanie do pierwszej trasy..."
                addCustomerToRoute(rI,customer1,customer2)
            }else if((rJ != rI) && rJ && rI && !isInner(rJ,customer2) && !isInner(rI,customer1)){
                log.info "Laczenie dwoch tras..."
                VRPRoute merged = mergeRoutes(rI,customer1,rJ,customer2)
                if(merged) {
                    removeRoute(solution.routes, rI)
                    removeRoute(solution.routes, rJ)
                    solution.routes += merged
                }
            }else{
                //log.info "Nie moge nic zrobic z oszczednoscia: ${saving}"
            }
            calculateNormalRoute(solution)
        }
        calculateDriveRoute(solution)
        solution
    }

    def removeRoute(List<VRPRoute> vrpRoutes, VRPRoute route) {
        vrpRoutes.removeAll { it.points == route.points }
    }

    VRPRoute mergeRoutes(VRPRoute v1, VRPCustomer c1, VRPRoute v2, VRPCustomer c2) {
        //TODO: TODO:
        VRPRoute merged = new VRPRoute()
        merged.start = v1.start
        merged.end = v2.end
        if(isLast(v1,c1)){
            if(isLast(v2,c2) && v2.points.size() > 1) {
                log.info "Nie mozna polazyc sciezek"
                return null
            }
            merged.points = v1.points + v2.points
        }else{
            if(isFirst(v2,c2)&& v2.points.size() > 1){
                log.info "Nie mozna polazyc sciezek"
                return null
            }
            merged.points = v2.points + v1.points
        }
        return merged
    }

    def addCustomerToRoute(VRPRoute route, VRPCustomer c1, VRPCustomer c2) {
        if(isLast(route,c1)){
            route.points += c2
        }else{
            route.points.plus(0,c2)
        }
    }

    def isInner(VRPRoute route, VRPCustomer customer) {
        return !(isLast(route,customer) || isFirst(route,customer))
    }

    boolean isLast(VRPRoute route, VRPCustomer customer) {
        return route.points.last().id == customer.id
    }

    boolean  isFirst(VRPRoute route, VRPCustomer customer) {
        return route.points.first().id == customer.id
    }

    def createRoute(start, stop, customer1, customer2) {
        def route = new VRPRoute()
        route.start = start
        route.end = stop
        route.points += customer1
        route.points += customer2
        return route
    }

    //Wyszukuje trasę do której już nalezy podany odbiorca (jezeli taka nie istnieje zwracany jest null)
    VRPRoute findRoute(List<VRPRoute> routes, VRPCustomer customer) {
        return routes.find { r ->
            r.points.any{ p ->
                p.id == customer.id
            }
        }
    }

    def calculateDistances(VRPProblem vrpProblem) {
        logInfo "Obliczanie odleglosci..."
        double[][] distances = new double[vrpProblem.customers.size()+1][vrpProblem.customers.size()+1]
        vrpProblem.customers.eachWithIndex { VRPCustomer c, int i ->
            distances[i+1][0] = routingUtilService.calculateDistanceForSphericalEarth(vrpProblem.depot,c)
            distances[0][i+1] = routingUtilService.calculateDistanceForSphericalEarth(c,vrpProblem.depot)
            //Obliczamy n^2, a nie (n^2)/2 bo droga powrotna może mieć inna dlugosc
            vrpProblem.customers.eachWithIndex { VRPCustomer c2, int j ->
                distances[i+1][j+1] = routingUtilService.calculateDistanceForSphericalEarth(c2,c)
            }
        }
        log.debug "Macierz odleglosci:"
        log.debug "\n" + JsonOutput.prettyPrint(JsonOutput.toJson(distances))
        distances
    }

    List<Saving> calculateSavings(double[][] distances) {
        logInfo "Obliczanie oszczednosci..."
        List<Saving> savings = []
        for (int i = 1; i < distances.length; i++) {
            for (int j = 1; j < distances.length; j++) {
                if(i!=j) {
                    double saving = distances[i][0] + distances[0][j] - distances[i][j]
                    savings.add Saving.create(i, j, saving)
                }
            }
        }
        savings = savings.sort{ -1 * it.v }
        log.debug "Obliczone oszczednosci:"
        log.debug "\n" + JsonOutput.prettyPrint(JsonOutput.toJson(savings))
        return savings
    }

    private VRPSolution createInitialSolution(VRPProblem problem) {
        logInfo "Obliczam wstepne rozwiazanie..."
        VRPSolution solution = new VRPSolution()
        problem.customers.each {
            VRPRoute route = new VRPRoute()
            route.start = problem.depots[0]
            route.end = problem.depots[0]
            route.points += it
            solution.routes += route
        }
        solution
    }

}

@ToString
class Saving{

    int i
    int j
    double v

    static Saving create(int i, int j, double v) {
        new Saving(i:i,j:j,v:v)
    }
}
