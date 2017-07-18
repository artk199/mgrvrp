import config.MyWebSocketConfig
import filters.CorsFilter

// Place your Spring DSL code here
beans = {
    corsFilter(CorsFilter)
    websocketConfig(MyWebSocketConfig)
}
