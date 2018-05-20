//
// Copyright 2012 Google
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package pl.mgr.vrp.benchmark;

import com.google.ortools.constraintsolver.Assignment;
import com.google.ortools.constraintsolver.IntVar;
import com.google.ortools.constraintsolver.NodeEvaluator2;
import com.google.ortools.constraintsolver.RoutingModel;
import com.google.ortools.constraintsolver.FirstSolutionStrategy;
import com.google.ortools.constraintsolver.RoutingSearchParameters;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.logging.Logger;

// A pair class

class Pair<K, V> {
    final K first;
    final V second;

    public static <K, V> Pair<K, V> of(K element0, V element1) {
        return new Pair<K, V>(element0, element1);
    }

    public Pair(K element0, V element1) {
        this.first = element0;
        this.second = element1;
    }
}

/**
 * Sample showing how to model and solve a capacitated vehicle routing problem
 * with time windows using the swig-wrapped version of the vehicle routing
 * library in src/constraint_solver.
 */

public class CapacitatedVehicleRoutingProblemWithTimeWindows {

    static {
        System.loadLibrary("jniortools");
    }

    private static Logger logger =
            Logger.getLogger(CapacitatedVehicleRoutingProblemWithTimeWindows.class.getName());

    private List<Pair<Integer, Integer>> locations = new ArrayList();
    private List<Integer> orderDemands = new ArrayList();

    // Random number generator to produce data.
    private final Random randomGenerator = new Random(0xBEEF);


    /**
     * Creates order data. Location of the order is random, as well as its
     * demand (quantity), time window and penalty.
     *
     * @param numberOfOrders number of orders to build.
     * @param xMax           maximum x coordinate in which orders are located.
     * @param yMax           maximum y coordinate in which orders are located.
     * @param demandMax      maximum quantity of a demand.
     */
    private void buildOrders(int numberOfOrders,
                             int xMax, int yMax,
                             int demandMax) {
        logger.info("Building orders.");
        for (int order = 0; order < numberOfOrders; ++order) {
            locations.add(Pair.of(randomGenerator.nextInt(xMax + 1),
                    randomGenerator.nextInt(yMax + 1)));
            orderDemands.add(randomGenerator.nextInt(demandMax + 1));
        }
    }

    /**
     * Solves the current routing problem.
     */
    private void solve(final int numberOfOrders, final int numberOfVehicles) {

        logger.info("Creating model with " + numberOfOrders + " orders and " +
                numberOfVehicles + " vehicles.");
        // Finalizing model
        final int numberOfLocations = locations.size();

        RoutingModel model = new RoutingModel(numberOfLocations, numberOfVehicles, 0);

        NodeEvaluator2 demandCallback = new NodeEvaluator2() {
            @Override
            public long run(int firstIndex, int secondIndex) {
                return 50;
            }
        };
        int vehicleCapacity = 200;
        model.addDimension(demandCallback, 0, vehicleCapacity, true, "capacity");

        NodeEvaluator2 manhattanCostCallback = new NodeEvaluator2() {
            @Override
            public long run(int firstIndex, int secondIndex) {
                try {
                    Pair<Integer, Integer> firstLocation = locations.get(firstIndex);
                    Pair<Integer, Integer> secondLocation = locations.get(secondIndex);
                    return (Math.abs(firstLocation.first - secondLocation.first) +
                            Math.abs(firstLocation.second - secondLocation.second));
                } catch (Throwable throwed) {
                    logger.warning(throwed.getMessage());
                    return 0;
                }
            }
        };
        model.setArcCostEvaluatorOfAllVehicles(manhattanCostCallback);

        logger.info("Search");
        Assignment solution = model.solveWithParameters(RoutingModel.defaultSearchParameters());

        if (solution != null) {
            String output = "Total cost: " + solution.objectiveValue() + "\n";
            // Dropped orders
            String dropped = "";
            for (int order = 0; order < numberOfOrders; ++order) {
                if (solution.value(model.nextVar(order)) == order) {
                    dropped += " " + order;
                }
            }
            if (dropped.length() > 0) {
                output += "Dropped orders:" + dropped + "\n";
            }
            // Routes
            for (int vehicle = 0; vehicle < numberOfVehicles; ++vehicle) {
                String route = "Vehicle " + vehicle + ": ";
                long order = model.start(vehicle);
                if (model.isEnd(solution.value(model.nextVar(order)))) {
                    route += "Empty";
                } else {
                    for (;
                         !model.isEnd(order);
                         order = solution.value(model.nextVar(order))) {
                        IntVar load = model.cumulVar(order, "capacity");
                        route += order + " Load(" + solution.value(load) + ") ";
                    }
                    IntVar load = model.cumulVar(order, "capacity");
                    route += order + " Load(" + solution.value(load) + ") ";
                }
                output += route + "\n";
            }
            logger.info(output);
        }
    }

    public static void main(String[] args) throws Exception {
        CapacitatedVehicleRoutingProblemWithTimeWindows problem =
                new CapacitatedVehicleRoutingProblemWithTimeWindows();
        final int xMax = 20;
        final int yMax = 20;
        final int demandMax = 3;
        final int orders = 10;
        final int vehicles = 10;

        problem.buildOrders(orders,
                xMax,
                yMax,
                demandMax);

        problem.solve(orders, vehicles);
    }
}
