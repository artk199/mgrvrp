package mgrvrp.rest

import groovy.json.JsonBuilder
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate

class TestJob {

    static triggers = {
        simple repeatInterval: 2500L
    }

    SimpMessagingTemplate brokerMessagingTemplate

    def group = "ChatGroup"
    def description = "Publishes a private chat message every 10 seconds"


    def execute() {
        def builder = new JsonBuilder()
        builder {
            message("Hello, user!")
            timestamp(new Date())
        }

        //Note the lack of the leading /user compared to what the webpage subscribes to
        // - this is added automatically
        //brokerMessagingTemplate.convertAndSend "/topic/hello", builder
        //brokerMessagingTemplate.convertAndSend "/topic/hello", builder
        //brokerMessagingTemplate.convertAndSend "/app/hello", "cos"

        //println "Sent private message"
    }
}
