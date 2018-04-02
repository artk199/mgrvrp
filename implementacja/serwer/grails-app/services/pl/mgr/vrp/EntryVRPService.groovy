package pl.mgr.vrp

import rx.Observable;
import grails.util.Holders
import org.springframework.context.ApplicationContext
import rx.Subscriber
import java.util.concurrent.BlockingQueue
import java.util.concurrent.LinkedBlockingQueue

class EntryVRPService {

    private final String DEFAULT_ALGORITHM = 'savings'

    private Map<String, SolverSubject> activeSubjects = [:]

    Observable<SolverEvent> prepareAndSolve(ProblemWithSettings problemWithSettings) {
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


    String createSolverSubject(ProblemWithSettings problemWithSettings) {
        String key = UUID.randomUUID().toString()
        SolverSubject subject = new SolverSubject()

        prepareAndSolve(problemWithSettings).subscribe(new Subscriber<SolverEvent>() {
            @Override
            void onCompleted() {
                log.info("Solution ended.")
            }

            @Override
            void onError(Throwable e) {
                log.error("Not known error", e)
                subject.eventsQueue.put(new SolverEvent(eventType: "ERROR", message: e.message))
            }

            @Override
            void onNext(SolverEvent solverEvent) {
                log.debug "Adding event to queue: ${solverEvent.eventType}"
                subject.eventsQueue.put(solverEvent)
            }
        })

        activeSubjects.put(key, subject)
        return key
    }

    SolverEvent getSolverSubjectValue(String key, boolean blocking = true) {
        SolverSubject subject = activeSubjects[key]
        if (!subject) {
            log.error "Cannot find subject for given key: $key"
            return null
        }
        if (blocking)
            return subject.eventsQueue.take()
        else
            return subject.eventsQueue.poll()
    }

    void removeSolverSubject(String key) {
        activeSubjects.remove(key)
    }

}

class SolverSubject {
    BlockingQueue<SolverEvent> eventsQueue = new LinkedBlockingQueue<>()
}