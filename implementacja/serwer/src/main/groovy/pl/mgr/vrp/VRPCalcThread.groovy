package pl.mgr.vrp

import groovy.util.logging.Slf4j
import pl.mgr.vrp.VRPProblem

@Slf4j
abstract class VRPCalcThread extends Thread {

    VRPProblem problem

    VRPCalcThread(VRPProblem vrpProblem){
        this.problem = vrpProblem
    }

    @Override
    void run() {
        solve(problem)
    }

    abstract void solve(VRPProblem problem);

    void logInfo(String info){
        log.info info
        println info
        //TODO: Implementacja czegos co wysyla gdzies
    }

    void logStep(String info, VRPSolution solution){

    }

}