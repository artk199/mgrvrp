package pl.mgr.vrp

import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService
import pl.mgr.vrp.model.VRPSolution

class BootStrap {

    SpringSecurityService springSecurityService

    def init = { servletContext ->
        Role role = Role.findOrSaveWhere(authority: 'ROLE_USER')
        def admin = User.findOrCreateWhere(username: 'admin')
        admin.password = 'admin'
        admin.save()
        UserRole.findOrSaveWhere(user: admin, role: role)
        RoutingDistanceUtil.init()
    }

    def destroy = {
    }
}
