import config.MyWebSocketConfig
import filters.CorsFilter
import pl.mgr.vrp.security.DummyLogoutSuccessHandler

// Place your Spring DSL code here
beans = {
    logoutSuccessHandler(DummyLogoutSuccessHandler)
    corsFilter(CorsFilter)
    websocketConfig(MyWebSocketConfig)
}
