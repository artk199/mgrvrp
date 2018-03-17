package pl.mgr.vrp

import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService
import grails.plugin.springsecurity.annotation.Secured
import grails.plugin.springsecurity.userdetails.GrailsUser

class UserController {

    SpringSecurityService springSecurityService

    @Secured(["ROLE_USER"])
    def profile() {
        GrailsUser user = (GrailsUser) springSecurityService.principal
        render([username: user.username] as JSON)
    }

    def register() {

    }
}
