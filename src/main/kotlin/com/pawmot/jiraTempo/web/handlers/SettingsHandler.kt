package com.pawmot.jiraTempo.web.handlers

import com.pawmot.jiraTempo.web.dto.SettingsDto
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.bodyToMono
import reactor.core.publisher.Mono
import java.util.concurrent.locks.ReadWriteLock
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.concurrent.withLock

@Component
class SettingsHandler {
    private val rwLock: ReadWriteLock = ReentrantReadWriteLock()
    private var settings: SettingsDto = SettingsDto(null, null)

    fun getSettings(req: ServerRequest): Mono<ServerResponse> {
        val rLock = rwLock.readLock()
        rLock.withLock {
            return ServerResponse.status(HttpStatus.OK).syncBody(settings)
        }
    }

    fun saveSettings(req: ServerRequest): Mono<ServerResponse> =
            req.bodyToMono<SettingsDto>().flatMap {
                val wLock = rwLock.writeLock()
                wLock.withLock { settings = it }
                ServerResponse.noContent().build()
            }
}