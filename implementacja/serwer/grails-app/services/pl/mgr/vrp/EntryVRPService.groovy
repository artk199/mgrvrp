package pl.mgr.vrp

import grails.util.Holders
import org.springframework.context.ApplicationContext
import pl.mgr.vrp.model.VRPProblem

class EntryVRPService {

    private final String DEFAULT_ALGORITHM = 'savings'

    def prepareAndSolve(VRPProblem problem) {
        def algorithmName = problem.algorithm?.code
        if (!algorithmName) {
            algorithmName = DEFAULT_ALGORITHM
            log.warn "Brak wybranego algorytmu - zostanie wybrany defaultowy."
        }
        log.info "Obsługa według algorytmu - ${algorithmName}"
        ApplicationContext ctx = Holders.applicationContext
        def service = ctx.getBean(algorithmName + "VRPSolverService")
        if (!service || !(service instanceof VRPSolverService)) {
            log.error "Nie mozna znaleźć algorytmu lub algorytm nie implementuje 'VRPSolverService'! Koniec."
        } else {
            service.solve(problem)
        }
    }

}
