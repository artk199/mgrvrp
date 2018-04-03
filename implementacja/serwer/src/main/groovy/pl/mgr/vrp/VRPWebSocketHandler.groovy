package pl.mgr.vrp

import grails.util.Holders
import groovy.util.logging.Slf4j
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.WebSocketMessage
import org.springframework.web.socket.WebSocketSession

@Slf4j
class VRPWebSocketHandler implements WebSocketHandler {

    @Override
    void afterConnectionEstablished(final WebSocketSession webSocketSession) throws Exception {
        String code = webSocketSession.uri
        code = code - '/socket?code='
        EntryVRPService entryVRPService = Holders.applicationContext.getBean('entryVRPService') as EntryVRPService
        boolean exitCondition = false
        while (!exitCondition) {
            SolverEvent solutionEvent = entryVRPService.getSolverSubjectValue(code)
            def json = solutionEvent.toJson()
            webSocketSession.sendMessage(new TextMessage(json.toString()));
            if (solutionEvent.eventType == SolverEventType.END) {
                exitCondition = true
                entryVRPService.removeSolverSubject(code)
            }
        }
        webSocketSession.close()
    }

    @Override
    void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        log.debug "Message: $message"
    }

    @Override
    void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.debug "Exception $exception"
    }

    @Override
    void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        log.debug "Closed: $closeStatus"
    }

    @Override
    boolean supportsPartialMessages() {
        return false
    }
}
