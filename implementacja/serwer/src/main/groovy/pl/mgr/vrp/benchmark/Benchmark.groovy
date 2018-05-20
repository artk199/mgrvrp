package pl.mgr.vrp.benchmark

import groovy.time.TimeCategory
import groovy.time.TimeDuration
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.RoutingDistanceUtil
import pl.mgr.vrp.VRPSolverService
import pl.mgr.vrp.model.VRPAlgorithm
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPDepot
import pl.mgr.vrp.model.VRPDistanceType
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPSolution

@Slf4j
@CompileStatic
class Benchmark {

    static {
        System.loadLibrary("jniortools")
        RoutingDistanceUtil.initGraphHopper("C:\\tmp\\pomorskie-latest.osm.pbf", "C:\\tmp\\")
    }

    static List<BenchmarkSuite> benchmarks = []
    static String timestamp = "${new Date().time}"

    static main(def args) {

        20.times {
            benchmarks = VRPFileUtils.loadBenchmarksWithSize((it + 1) * 10)
            startAlgorithmTest()
        }


    }

    static void startAlgorithmTest() {

        CSVBuilder out = CSVBuilder.newInstance(timestamp, "algorithms")
        out.buildLine([
                "id",
                "size",
                "air distance matrix time",
                "savings air time",
                "savings air result",
                "nn air time",
                "nn air result",
                "jsprit air time",
                "jsprit air result",
                "google air time",
                "google air result",
                "road distance matrix time",
                "savings road time",
                "savings road result",
                "nn road time",
                "nn road result",
                "jsprit road time",
                "jsprit road result",
                "google road time",
                "google road result"
        ])

        def distanceTypes = [VRPDistanceType.AIR/*, VRPDistanceType.ROAD*/]
        def algorithms = [VRPAlgorithm.SAVINGS/*, VRPAlgorithm.NN, VRPAlgorithm.JSPRIT, VRPAlgorithm.GOOGLE_OR*/]

        benchmarks.each { suite ->
            out.append([suite.uuid, suite.customersCount])
            distanceTypes.each { distanceType ->
                suite.setDistanceType(distanceType)
                suite.startDistanceMatrixTest()
                out.append([suite.result.distanceMatrixDurationInMs])
                algorithms.each { algorithm ->
                    suite.setAlgorithm(algorithm)
                    suite.startAlgorithmTest()
                    out.append([suite.result.algorithmTimeDurationInMs, suite.result.result])
                }
            }
            out.endl()
        }

    }

    static void startTimeDistanceTypeTest() {
        log.info "Start distance type time tests"

        CSVBuilder out = CSVBuilder.newInstance(timestamp, "time_distance_type")
        out.buildLine(["id", "size", "algorithm", "air result", "road result"])
        int noTests = 10
        benchmarks.each { BenchmarkSuite suite ->
            int leftTests = noTests
            while (leftTests > 0) {
                suite.init()
                suite.setDistanceType(VRPDistanceType.AIR)
                suite.startDistanceMatrixTest()
                BenchmarkSuite.BenchmarkSuiteResult airResult = suite.result
                suite.reset()
                suite.setDistanceType(VRPDistanceType.ROAD)
                suite.startDistanceMatrixTest()
                BenchmarkSuite.BenchmarkSuiteResult roadResult = suite.result
                if (!roadResult.errorMessage && !airResult.errorMessage) {
                    leftTests--
                    suite.saveProblemToFile()
                    out.buildLine([suite.uuid, suite.customersCount, airResult.distanceMatrixDurationInMs, roadResult.distanceMatrixDurationInMs])
                }

            }
        }

    }

    static void startDistanceTypeTest() {

        log.info "Start distance type tests"

        CSVBuilder distanceTypeOut = CSVBuilder.newInstance(timestamp, "distance_type")

        distanceTypeOut.buildLine(["size", "algorithm", "air result", "road result", "air - road"])

        int noTests = 10

        def algorithms = [VRPAlgorithm.SAVINGS, VRPAlgorithm.JSPRIT]

        benchmarks.each { BenchmarkSuite suite ->
            algorithms.each { algorithm ->
                int leftTests = 10
                while (leftTests > 0) {
                    suite.init()
                    suite.setDistanceType(VRPDistanceType.AIR)
                    suite.setAlgorithm(algorithm)
                    suite.fullTest()
                    BenchmarkSuite.BenchmarkSuiteResult airResult = suite.result
                    suite.reset()
                    suite.setDistanceType(VRPDistanceType.ROAD)
                    suite.setAlgorithm(algorithm)
                    suite.startDistanceMatrixTest()
                    BenchmarkSuite.BenchmarkSuiteResult roadResult = suite.result
                    if (!roadResult.errorMessage && !airResult.errorMessage) {
                        leftTests--
                        distanceTypeOut.buildLine([suite.customersCount, algorithm, airResult.result, roadResult.result, airResult.result - roadResult.result])
                    }
                }
            }
        }

    }

}


@Slf4j
class BenchmarkSuite {

    //Ilu odbiorców w teście
    int customersCount

    Double demand = 50

    double[][] distanceMatrix = null

    PointOnMapGenerator pointOnMapGenerator = new PointOnMapGenerator()

    //Unikalne ID problemu
    String uuid = null

    ProblemWithSettings pws = new ProblemWithSettings()

    BenchmarkSuiteResult result

    static BenchmarkSuite createForProblem(VRPProblem vrpProblem, String uuid) {
        BenchmarkSuite suite = new BenchmarkSuite()
        suite.pws.problem = vrpProblem
        suite.customersCount = vrpProblem.customers.size()
        suite.reset()
        suite.uuid = uuid
        suite
    }

    void init() {
        log.info "Inicjalizaja benchmarku z ${customersCount} odbiorcami"

        //Utworzenie problemu
        pws.problem = new VRPProblem()

        pws.problem.customers = [] as Set
        pws.problem.depots = [] as Set
        pws.problem.solutions = [] as Set

        //Utworzenie odbiorców
        customersCount.times { int i ->
            pws.problem.customers.add generateCustomer(i)
        }

        //Utworzenie magazynu
        pws.problem.depots << generateDepot()

        this.reset()

        log.info "Koniec inicjalizacji"
    }

    def reset() {
        //Ustawienie defaultowych wartości
        pws.algorithm = VRPAlgorithm.SAVINGS
        pws.distanceType = VRPDistanceType.AIR
        pws.problem.capacity = 200
        result = null
        uuid = null
    }

    //Generuje nowego odbiorce w podanym zakresie
    VRPCustomer generateCustomer(int i) {
        def rndPoint = pointOnMapGenerator.randomPoint()
        VRPCustomer customer = new VRPCustomer(name: i.toString(), x: rndPoint.x, y: rndPoint.y)
        customer.demand = this.demand
        return customer
    }

    //Generuje nowy magazyn
    VRPDepot generateDepot() {
        def rndPoint = pointOnMapGenerator.randomPoint()
        return new VRPDepot(name: "depot", x: rndPoint.x, y: rndPoint.y)
    }

    //Ustawia sposób obliczania macierzy odległości
    void setDistanceType(String type) {
        this.pws.distanceType = type
    }

    //Ustawia sposób obliczania rozwiazania
    void setAlgorithm(String algorithm) {
        this.pws.algorithm = algorithm
    }

    /**
     * Przeprowadza test obliczania macierzy odległości
     */
    void startDistanceMatrixTest() {
        log.info "Start testowania obliczania macierzy odległosci: ${pws.distanceType}"

        initResult()

        try {
            Date start = new Date()
            distanceMatrix = RoutingDistanceUtil.calculateDistanceMatrix(pws)
            Date stop = new Date()
            result.distanceMatrixDuration = TimeCategory.minus(stop, start)

        } catch (Exception e) {
            e.printStackTrace()
            log.error "Blad podczas obliczania macierzy: " + e.message
            result.errorMessage = e.message
        }

        log.info "Koniec testowania obliczania macierzy odległości, czas: ${result.distanceMatrixDuration}"
    }

    /**
     * Przeprowadza test algorytmu
     */
    void startAlgorithmTest() {
        log.info "Start testowania algorytmu: ${pws.algorithm}"
        initResult()

        VRPSolverService service = VRPAlgorithm.getSolverService(pws.algorithm)

        if (service == null) {
            result.errorMessage = "Unknown algorithm: ${pws.algorithm}"
            return
        }

        try {
            Date start = new Date()

            VRPSolution solution = service.calculateSolution(pws, distanceMatrix)

            Date stop = new Date()
            result.algorithmTimeDuration = TimeCategory.minus(stop, start)
            result.solution = solution
            service.calculateRoute(solution, VRPDistanceType.ROAD)
            result.result = solution.routeLength
        } catch (Exception e) {
            e.printStackTrace()
            log.error "Blad podczas obliczania rozwiazania: " + e.message
            result.errorMessage = e.message
        }


        log.info "Koniec testowania algorytmu, czas: ${result.distanceMatrixDuration}, wynik: ${result.result}"
    }

    /**
     * Uruchamia test oblizania macierzy odległości oraz algorytmu
     */
    void fullTest() {
        log.info "Start pełnego testu"

        startDistanceMatrixTest()
        startAlgorithmTest()

        log.info "Koniec pełnego testu"
    }

    void initResult() {
        if (!result) {
            result = new BenchmarkSuiteResult(pws)
        }
    }

    def saveProblemToFile() {
        uuid = UUID.randomUUID().toString()
        VRPFileUtils.exportToVRPFile(pws.problem, uuid)
    }

    @CompileStatic
    class BenchmarkSuiteResult {

        int size
        VRPSolution solution
        String algorithm
        String distanceType
        TimeDuration distanceMatrixDuration
        TimeDuration algorithmTimeDuration
        BigDecimal result = 0
        String errorMessage = null

        BenchmarkSuiteResult(ProblemWithSettings pws) {
            this.size = pws.problem.customers.size()
            this.algorithm = pws.algorithm
            this.distanceType = pws.distanceType
        }

        double getDistanceMatrixDurationInMs() {
            distanceMatrixDuration ? distanceMatrixDuration.toMilliseconds() : 0
        }

        double getAlgorithmTimeDurationInMs() {
            algorithmTimeDuration ? algorithmTimeDuration.toMilliseconds() : 0
        }

        void printToConsole() {
            println this.toString()
        }

        String toString() {
            if (errorMessage)
                return "${size},${algorithm},${distanceType},${errorMessage}"
            return "${size},${algorithm},${distanceType},${distanceMatrixDurationInMs},${algorithmTimeDurationInMs},${result}"
        }
    }
}