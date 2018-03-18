package pl.mgr.vrp

import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService
import grails.plugin.springsecurity.annotation.Secured
import grails.plugin.springsecurity.userdetails.GrailsUser
import grails.transaction.Transactional
import org.springframework.context.MessageSource

@Transactional
class UserController {

    SpringSecurityService springSecurityService
    MessageSource messageSource

    @Secured(["ROLE_USER"])
    def profile() {
        GrailsUser user = (GrailsUser) springSecurityService.principal
        render([username: user.username] as JSON)
    }

    def register() {
        String username = params.get('username')
        String password = params.get('password')
        String confirmPassword = params.get('confirmPassword')

        String error
        if (password != confirmPassword) {
            error = messageSource.getMessage('springSecurity.errors.register.passwordMissmatch', null, "Password and confirm password does not match", request.locale)
        } else if (!username || username.trim() == '') {
            error = messageSource.getMessage('springSecurity.errors.register.usernameNull', null, "Username cannot be empty", request.locale)
        } else if (User.findByUsername(username)) {
            error = messageSource.getMessage('springSecurity.errors.register.usernameNotUnique', null, "Account with this username already exists", request.locale)
        } else if (!password || password.length() < 6) {
            error = messageSource.getMessage('springSecurity.errors.register.passwordLength', null, "Password should have at least 6 characters", request.locale)
        }


        if (error) {
            render([error: error] as JSON)
        } else {
            User user = new User()
            user.username = username
            user.password = password
            user.save()
            UserRole userRole = new UserRole(user: user, role: Role.findByAuthority("ROLE_USER"))
            userRole.save()
            render([success: true, username: username] as JSON)
        }
    }

    @Secured(["ROLE_USER"])
    def changePassword() {

        String oldPassword = params.get("oldPassword")
        String newPassword = params.get("newPassword")
        String confirmPassword = params.get("confirmPassword")

        User user = User.findByUsername(springSecurityService.principal.username)
        boolean isPasswordValid = springSecurityService.passwordEncoder.isPasswordValid(user.password, oldPassword, null)

        String error
        if (!isPasswordValid) {
            error = messageSource.getMessage('springSecurity.errors.change.password.incorrect', null, "Incorrect current password.", request.locale)
        } else if (newPassword != confirmPassword) {
            error = messageSource.getMessage('springSecurity.errors.change.password.passwordMissmatch', null, "Password and confirm password does not match", request.locale)
        } else if (!newPassword || newPassword.length() < 6) {
            error = messageSource.getMessage('springSecurity.errors.change.password.passwordLength', null, "Password should have at least 6 characters", request.locale)
        }

        if (error) {
            render([error: error] as JSON)
        } else {
            user.password = newPassword
            user.save()
            render([success: true, username: user.username] as JSON)
        }

    }
}
