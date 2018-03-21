package pl.mgr.vrp

import grails.util.Holders
import org.springframework.context.ApplicationContext
import pl.mgr.vrp.model.VRPProblem
import pl.mgr.vrp.model.VRPSolution

class EntryVRPService {

    private final String DEFAULT_ALGORITHM = 'savings'

    VRPSolution prepareAndSolve(ProblemWithSettings problemWithSettings) {
        String algorithmName = getAlgorithmName(problemWithSettings)
        VRPSolverService solverService = findVRPSolverBean(algorithmName)
        return solverService.solve(problemWithSettings)
    }

    private String getAlgorithmName(ProblemWithSettings problemWithSettings) {
        def algorithmName = problemWithSettings.getAlgorithm()
        if (!algorithmName) {
            algorithmName = DEFAULT_ALGORITHM
            log.warn "Brak wybranego algorytmu - zostanie wybrany defaultowy."
        }
        log.info "Obsługa według algorytmu - ${algorithmName}"
        algorithmName
    }

    private static VRPSolverService findVRPSolverBean(String algorithmName) {
        ApplicationContext ctx = Holders.applicationContext
        def service = ctx.getBean(algorithmName + "VRPSolverService")
        if (!service || !(service instanceof VRPSolverService)) {
            throw new InvalidAlgorithmException("Given algotithm not yet implemented");
        }
        return service
    }

}
