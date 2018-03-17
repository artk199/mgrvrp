package pl.mgr.vrp

import grails.plugin.springsecurity.SpringSecurityService

class BootStrap {

    SpringSecurityService springSecurityService

    def init = { servletContext ->
        Role role = Role.findOrSaveWhere(authority: 'ROLE_USER')
        def admin = User.findOrCreateWhere(username: 'admin')
        admin.password = 'admin'
        admin.save()
        UserRole.findOrSaveWhere(user: admin, role: role)
    }

    def destroy = {
    }
}
