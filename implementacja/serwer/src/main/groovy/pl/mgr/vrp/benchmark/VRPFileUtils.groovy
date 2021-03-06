package pl.mgr.vrp.benchmark

import pl.mgr.vrp.ProblemWithSettings
import pl.mgr.vrp.model.VRPCustomer
import pl.mgr.vrp.model.VRPDepot
import pl.mgr.vrp.model.VRPProblem

class VRPFileUtils {

    static final String BASE_URL = "C:/tmp/problems/"

    static void exportToVRPFile(VRPProblem problem, String uuid) {
        File out = new File(BASE_URL + "problem_n${problem.customers.size()}_${uuid}.vrp")
        out << "NAME : POMORSKIE-n${problem.customers.size()}\n"
        out << "COMMENT : Auto generated by mgrVRP\n"
        out << "TYPE : CVRP\n"
        out << "DIMENSION : ${problem.customers.size()}\n"
        out << "EDGE_WEIGHT_TYPE : EUC_2D\n"
        out << "CAPACITY : ${problem.capacity}\n"
        out << "NODE_COORD_SECTION\n"
        out << "1 ${problem.depot.x} ${problem.depot.y}\n"
        problem.customers.eachWithIndex { c, i ->
            out << "${i + 2} ${c.x} ${c.y}\n"
        }
        out << "DEMAND_SECTION\n"
        out << "1 0\n"
        problem.customers.eachWithIndex { c, i ->
            out << "${i + 2} ${c.demand}\n"
        }
        out << "DEPOT_SECTION\n"
        out << "1\n"
        out << "-1\n"
        out << "EOF\n"
    }

    static VRPProblem importVRPFile(String fileName) {

        File file = new File(BASE_URL + fileName)

        String name = ""
        double capacity = 0
        Integer dimension = 0

        String currentSection = "NONE"

        List customers = []
        List demands = []
        int depot = -1

        file.withReader { reader ->
            String line
            while (line = reader.readLine()) {
                if (line.startsWith("NODE_COORD_SECTION")) {
                    currentSection = "NODE_COORD_SECTION"
                    continue
                }
                if (line.startsWith("DEMAND_SECTION")) {
                    currentSection = "DEMAND_SECTION"
                    continue
                }
                if (line.startsWith("DEPOT_SECTION")) {
                    currentSection = "DEPOT_SECTION"
                    continue
                }
                if (line.startsWith("EOF")) {
                    currentSection = "EOF"
                    continue
                }
                switch (currentSection) {
                    case "NODE_COORD_SECTION":
                        line = line.trim()
                        def cords = line.split(' ')
                        customers.add([x: Double.valueOf(cords[1]), y: Double.valueOf(cords[2])])
                        break;
                    case "DEMAND_SECTION":
                        line = line.trim()
                        def spl = line.split(' ')
                        demands.add(Double.valueOf(spl[1]))
                        break;
                    case "DEPOT_SECTION":
                        line = line.trim()
                        depot = Integer.valueOf(line) - 1
                        currentSection = ""
                        break
                    default:
                        def splitted = line.split(' : ')
                        if (splitted[0] == "NAME") {
                            name = splitted[1]
                        }
                        if (splitted[0] == "CAPACITY") {
                            capacity = Double.valueOf(splitted[1])
                        }
                        if (splitted[0] == "DIMENSION") {
                            dimension = Integer.valueOf(splitted[1])
                        }
                        if (splitted[0] == "NODE_COORD_SECTION") {
                            currentSection = "NODE_COORD_SECTION"
                        }
                        if (splitted[0] == "DEMAND_SECTION") {
                            currentSection = "DEMAND_SECTION"
                        }
                }
                println line
            }
        }
        VRPProblem problem = new VRPProblem()
        problem.customers = [] as Set
        problem.depots = [] as Set
        problem.capacity = capacity
        customers.eachWithIndex { p, i ->
            if (i == depot) {
                VRPDepot d = new VRPDepot()
                d.x = p.x
                d.y = p.y
                d.name = "${i}"
                problem.depots.add d
            } else {
                VRPCustomer c = new VRPCustomer()
                c.x = p.x
                c.y = p.y
                c.demand = demands.get(i)
                c.name = "${i}"
                problem.customers.add(c)
            }
        }
        return problem
    }


    static List<BenchmarkSuite> loadBenchmarksWithSize(int n) {
        List<String> files = []
        new File(BASE_URL).eachFileMatch(~/^problem_n${n}_.*\.vrp$/) { files << it.name }
        List<BenchmarkSuite> benchmarkSuites = []
        files.each { String f ->
            VRPProblem problem = importVRPFile(f)
            BenchmarkSuite benchmark = BenchmarkSuite.createForProblem(problem, f)
            benchmarkSuites.add benchmark
        }
        return benchmarkSuites
    }

    public static void main(args) {
        Random rnd = new Random()
        //20.times { i ->
            def ben = loadBenchmarksWithSize(100
            )
            ben.each { BenchmarkSuite suite ->
                suite.pws.problem.customers.each {
                    it.demand = (rnd.nextDouble() * 10 + 5).toInteger().toDouble()
                }
                exportToVRPFile(suite.pws.problem, UUID.randomUUID().toString())
            }
        //}
    }

}
