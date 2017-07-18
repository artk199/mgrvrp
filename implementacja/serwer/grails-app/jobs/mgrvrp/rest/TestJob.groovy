package mgrvrp.rest

import groovy.json.JsonBuilder
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate

class TestJob {

    static triggers = {
        simple repeatInterval: 2500L
    }

    /**
     * Inject the messenger that accepts Stomp messages.
     **/
    SimpMessagingTemplate brokerMessagingTemplate

    /**
     * Basic info about this Quartz job.
     **/
    def group = "ChatGroup"
    def description = "Publishes a private chat message every 10 seconds"

    /**
     * What actually gets executed as the job.
     **/
    def execute() {
        def builder = new JsonBuilder()
        builder {
            message("Hello, user!")
            timestamp(new Date())
        }

        //Note the lack of the leading /user compared to what the webpage subscribes to
        // - this is added automatically
        brokerMessagingTemplate.convertAndSend "/topic/hello", builder

        //println "Sent private message"
    }
}
