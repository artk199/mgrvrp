package pl.mgr.vrp

import grails.plugin.springsecurity.SpringSecurityService

class BootStrap {

    SpringSecurityService springSecurityService

    def init = { servletContext ->
        Role.findOrSaveWhere(authority: 'ROLE_USER', description: 'User role')
        def admin = User.findOrCreateWhere(username: 'admin')
        admin.password = 'admin'
        admin.save()
    }

    def destroy = {
    }
}
