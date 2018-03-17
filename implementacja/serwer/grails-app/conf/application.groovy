// Added by the Spring Security Core plugin:
grails.plugin.springsecurity.userLookup.userDomainClassName = 'pl.mgr.vrp.User'
grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'pl.mgr.vrp.UserRole'
grails.plugin.springsecurity.authority.className = 'pl.mgr.vrp.Role'
grails.plugin.springsecurity.sessionFixationPrevention.alwaysCreateSession = true
grails.plugin.springsecurity.auth.useForward = false
grails.plugin.springsecurity.controllerAnnotations.staticRules = [
        [pattern: '/**', access: ['permitAll']]
]

grails.plugin.springsecurity.filterChain.chainMap = [
        [pattern: '/**', filters: 'JOINED_FILTERS']
]

