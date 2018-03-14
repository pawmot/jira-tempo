package com.pawmot.jiraTempo.config

import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

// TODO: Remove after this is finished https://github.com/spring-projects/spring-boot/issues/9785
@Component
class IndexWebFilter : WebFilter {
    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        return if (exchange.request.uri.path == "/") {
            chain.filter(exchange.mutate().request(exchange.request.mutate().path("/index.html").build()).build())
        } else chain.filter(exchange)
    }
}