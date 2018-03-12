package com.pawmot.jiraTempo.web

import com.pawmot.jiraTempo.web.handlers.SettingsHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.server.router

@Configuration
class RoutesConfiguration {

    @Bean
    fun router(settingsHandler: SettingsHandler) = router {
        ("/api").nest {
            ("/settings").nest {
                GET(pattern = "/", f = settingsHandler::getSettings)
                PUT(pattern = "/", f = settingsHandler::saveSettings)
            }
        }
    }
}