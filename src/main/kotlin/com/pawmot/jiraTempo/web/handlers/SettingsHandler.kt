package com.pawmot.jiraTempo.web.handlers

import com.fasterxml.jackson.core.JsonProcessingException
import com.pawmot.jiraTempo.domain.settings.Settings
import com.pawmot.jiraTempo.domain.settings.SettingsRepository
import com.pawmot.jiraTempo.domain.settings.WorklogPeriod
import com.pawmot.jiraTempo.web.dto.*
import org.bson.types.ObjectId
import org.jasypt.util.text.TextEncryptor
import org.springframework.core.codec.DecodingException
import org.springframework.dao.OptimisticLockingFailureException
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.body
import org.springframework.web.reactive.function.server.bodyToMono
import reactor.core.publisher.Mono

@Component
class SettingsHandler(private val repo: SettingsRepository, private val encryptor: TextEncryptor) {

    private var settingsId: ObjectId? = null

    init {
        repo.findAll().singleOrEmpty()
                .subscribe {
                    settingsId = it.id
                }
    }

    fun getSettings(req: ServerRequest): Mono<ServerResponse> {
        return ServerResponse.status(HttpStatus.OK)
                .body(
                        if (settingsId != null)
                            repo.findById(settingsId!!).map { it.toDto() }
                        else
                            Mono.just(ReadSettingsDto(null, null, listOf(), listOf(), listOf(), null))
                )
    }

    fun saveSettings(req: ServerRequest): Mono<ServerResponse> =
            req.bodyToMono<SaveSettingsDto>().flatMap { dto ->
                val saving = repo.save(Settings(
                        id = settingsId,
                        jiraUrl = dto.jiraUrl!!,
                        login = dto.user?.login!!,
                        password = encryptor.encrypt(dto.user.password),
                        periods = dto.periods.map { WorklogPeriod(it.start, it.end) },
                        projects = dto.projects,
                        users = dto.users,
                        version = dto.version)
                )
                saving
            }.flatMap {
                settingsId = it.id
                ServerResponse.noContent().build()
            }.onErrorResume({
                when (it) {
                    is JsonProcessingException -> ServerResponse.badRequest().build()
                    is DecodingException -> ServerResponse.badRequest().build()
                    is OptimisticLockingFailureException -> ServerResponse.status(HttpStatus.CONFLICT).build()
                    else -> ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
                }
            })

    private fun Settings.toDto(): ReadSettingsDto {
        return ReadSettingsDto(this.jiraUrl,
                ReadJiraUserDto(this.login),
                this.periods.map { WorklogPeriodDto(it.start, it.end) },
                this.projects,
                this.users,
                this.version)
    }
}