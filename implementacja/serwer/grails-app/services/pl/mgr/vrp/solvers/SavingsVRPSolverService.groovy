package pl.mgr.vrp.solvers

import groovy.json.JsonOutput
import groovy.transform.CompileStatic
import groovy.transform.ToString
import groovy.util.logging.Slf4j
import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.RoutingUtilService
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPRoute
import pl.mgr.vrp.model.VRPSolution

@Slf4j
@CompileStatic
class SavingsVRPSolverService extends VRPSolverService {

    RoutingUtilService routingUtilService

    @Override
    protected VRPSolution calculateSolution(ProblemWithSettings problemWithSettings) {
        VRPSolution solution
        VRPProblem problem = problemWithSettings.problem
        double[][] distances = calculateDistances(problemWithSettings.problem, problemWithSettings.getDistanceType())
        List<Saving> savings = calculateSavings(distances)
        if (problemWithSettings.getSetting('type') == 'sequential') {
            solution = VRPSolution.createForProblemWithSettings(problemWithSettings)
            sequentialCreateRoutes(solution, savings, problemWithSettings)
        } else {
            solution = createInitialSolution(problemWithSettings)
            createRoutes(solution, savings, problemWithSettings)
        }
        solution
    }

    //Parallel version
    VRPSolution createRoutes(VRPSolution solution, List<Saving> savings, ProblemWithSettings problemWithSettings) {
        logInfo "Obliczanie tras..."
        //solution.routes = []
        VRPProblem problem = problemWithSettings.problem
        savings.each { saving ->

            VRPCustomer customer1 = problem.customers[saving.i - 1]
            VRPCustomer customer2 = problem.customers[saving.j - 1]

            def rI = findRoute(solution.routes, customer1)
            def rJ = findRoute(solution.routes, customer2)

            if (!rI && !rJ) {
                //Jeżeli żaden z punktów (i,j) nie został dodany do ścieżki to tworzymy nową zawierającą i oraz j
                VRPRoute createdRoute = createRoute(customer1, customer2)
                if (validateCapacity(createdRoute, problem.capacity)) {
                    solution.addToRoutes createdRoute
                }
                log.info "Tworzenie nowej trasy..."
            } else if (!rI && !isInner(rJ, customer2)) {
                log.info "Dodawanie do drugiej trasy..."
                addCustomerToRoute(rJ, customer2, customer1, problemWithSettings)
            } else if (!rJ && !isInner(rI, customer1)) {
                log.info "Dodawanie do pierwszej trasy..."
                addCustomerToRoute(rI, customer1, customer2, problemWithSettings)
            } else if ((rJ != rI) && rJ && rI && !isInner(rJ, customer2) && !isInner(rI, customer1)) {
                log.info "Laczenie dwoch tras..."
                VRPRoute merged = mergeRoutes(rI, customer1, rJ, customer2)
                if (merged && validateCapacity(merged, problem.capacity)) {
                    removeRoute(solution.routes, rI)
                    removeRoute(solution.routes, rJ)
                    solution.addToRoutes merged
                }
            } else {
                //log.info "Nie moge nic zrobic z oszczednoscia: ${saving}"
            }
        }
        solution
    }

    //Sequential version
    VRPSolution sequentialCreateRoutes(VRPSolution solution, List<Saving> savings, ProblemWithSettings problemWithSettings) {
        logInfo "Obliczanie tras..."
        //solution.routes = []

        VRPProblem problem = problemWithSettings.problem
        List<Saving> leftSavings = []

        VRPRoute currentRoute = null

        savings.each { saving ->

            VRPCustomer customer1 = problem.customers[saving.i - 1]
            VRPCustomer customer2 = problem.customers[saving.j - 1]

            def rI = findRoute(solution.routes, customer1)
            def rJ = findRoute(solution.routes, customer2)

            if (!rI && !rJ) {
                if (currentRoute == null) {
                    //Jeżeli żaden z punktów (i,j) nie został dodany do ścieżki to tworzymy nową zawierającą i oraz j
                    VRPRoute createdRoute = createRoute(customer1, customer2)
                    if (validateCapacity(createdRoute, problem.capacity)) {
                        solution.addToRoutes createdRoute
                        currentRoute = createdRoute
                        log.info "Tworzenie nowej trasy..."
                    }
                } else {
                    leftSavings.push(saving)
                }
            } else if (!rI && rJ == currentRoute && !isInner(rJ, customer2)) {
                log.info "Dodawanie do drugiej trasy..."
                if (!addCustomerToRoute(rJ, customer2, customer1, problemWithSettings)) {
                    leftSavings.push(saving)
                }
            } else if (!rJ && rI == currentRoute && !isInner(rI, customer1)) {
                log.info "Dodawanie do pierwszej trasy..."
                if (!addCustomerToRoute(rI, customer1, customer2, problemWithSettings)) {
                    leftSavings.push(saving)
                }
            } else {
                //
            }
        }

        if (!leftSavings.isEmpty()) {
            return sequentialCreateRoutes(solution, leftSavings, problemWithSettings)
        } else {
            return solution
        }
    }

    boolean validateCapacity(VRPRoute route, double maxCapacity) {
        double sum = 0
        route.points.each { VRPCustomer it ->
            sum += it.demand
        }
        return sum <= maxCapacity
    }

    def removeRoute(Collection<VRPRoute> vrpRoutes, VRPRoute route) {
        vrpRoutes.removeAll { it.points == route.points }
    }

    VRPRoute mergeRoutes(VRPRoute v1, VRPCustomer c1, VRPRoute v2, VRPCustomer c2) {
        //TODO: TODO:
        VRPRoute merged = new VRPRoute()
        if (isLast(v1, c1)) {
            if (isLast(v2, c2) && v2.points.size() > 1) {
                log.info "Nie mozna polazyc sciezek"
                return null
            }
            merged.points = v1.points + v2.points
        } else {
            if (isFirst(v2, c2) && v2.points.size() > 1) {
                log.info "Nie mozna polazyc sciezek"
                return null
            }
            merged.points = v2.points + v1.points
        }
        return merged
    }

    boolean addCustomerToRoute(VRPRoute route, VRPCustomer c1, VRPCustomer c2, ProblemWithSettings problem) {
        if (validateCapacity(route, problem.problem.capacity - c2.demand)) {
            if (isLast(route, c1)) {
                route.points.add c2
            } else {
                route.points.plus(0, c2)
            }
        } else {
            log.info "Nie mozna dodac punktu, przekroczona pojemnosc"
            return false
        }
        return true
    }

    def isInner(VRPRoute route, VRPCustomer customer) {
        return !(isLast(route, customer) || isFirst(route, customer))
    }

    boolean isLast(VRPRoute route, VRPCustomer customer) {
        VRPCustomer last = route.points.last()
        return last.id == customer.id
    }

    boolean isFirst(VRPRoute route, VRPCustomer customer) {
        return route.points.first().id == customer.id
    }

    VRPRoute createRoute(VRPCustomer customer1, VRPCustomer customer2) {
        def route = new VRPRoute()
        route.points.add customer1
        route.points.add customer2
        return route
    }

    //Wyszukuje trasę do której już nalezy podany odbiorca (jezeli taka nie istnieje zwracany jest null)
    VRPRoute findRoute(Collection<VRPRoute> routes, VRPCustomer customer) {
        return routes.find { r ->
            r.points.any { p ->
                p.id == customer.id
            }
        }
    }

    List<Saving> calculateSavings(double[][] distances) {
        logInfo "Obliczanie oszczednosci..."
        List<Saving> savings = []
        for (int i = 1; i < distances.length; i++) {
            for (int j = 1; j < distances.length; j++) {
                if (i != j) {
                    double saving = distances[i][0] + distances[0][j] - distances[i][j]
                    savings.add Saving.create(i, j, saving)
                }
            }
        }
        savings = savings.sort { -1 * it.v }
        log.debug "Obliczone oszczednosci:"
        log.debug "\n" + JsonOutput.prettyPrint(JsonOutput.toJson(savings))
        return savings
    }

    private VRPSolution createInitialSolution(ProblemWithSettings problemWithSettings) {
        logInfo "Obliczam wstepne rozwiazanie..."
        VRPSolution solution = VRPSolution.createForProblemWithSettings(problemWithSettings)
        problemWithSettings.problem.customers.each {
            VRPRoute route = new VRPRoute()
            route.points.add it
            solution.addToRoutes route
        }
        solution
    }

}

@ToString
class Saving {

    int i
    int j
    double v

    static Saving create(int i, int j, double v) {
        new Saving(i: i, j: j, v: v)
    }
}
