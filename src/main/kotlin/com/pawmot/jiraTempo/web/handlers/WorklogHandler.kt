package com.pawmot.jiraTempo.web.handlers

import com.pawmot.jiraTempo.domain.settings.Settings
import com.pawmot.jiraTempo.domain.settings.SettingsRepository
import com.pawmot.jiraTempo.domain.worklog.WorklogItem
import com.pawmot.jiraTempo.domain.worklog.WorklogRepository
import com.pawmot.jiraTempo.web.dto.SecondsLoggedOnDateDto
import com.pawmot.jiraTempo.web.dto.IssueWorklogDto
import com.pawmot.jiraTempo.web.dto.PersonalWorklogDto
import com.pawmot.jiraTempo.web.dto.WorklogDto
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.body
import reactor.core.publisher.Mono
import java.nio.file.Paths

@Service
class WorklogHandler(private val worklogRepository: WorklogRepository, private val settingsRepository: SettingsRepository) {

    fun get(req: ServerRequest): Mono<ServerResponse> {
        return ServerResponse.ok().body(
                settingsRepository.findAll().singleOrEmpty()
                        .flatMapMany { settings ->
                            worklogRepository.findAll()
                                    .map { WorklogDto(it.startDate, it.endDate, createPersonalWorklogs(settings, it.items)) }
                        })
    }

    private fun createPersonalWorklogs(settings: Settings, items: List<WorklogItem>): List<PersonalWorklogDto> {
        return settings.users.map { user ->
            val userItems = items.filter { it.user == user }

            val byIssue = userItems
                    .groupBy { it.issueKey }
                    .mapValues { summarizePerDay(it.value) }
                    .map { IssueWorklogDto(it.key, it.value, "${Paths.get(settings.jiraUrl, "browse", it.key)}") }
                    .sortedBy { it.loggedTime.map { it.date }.min() }

            PersonalWorklogDto(user, byIssue)
        }
                .sortedBy { it.userName }
    }

    private fun summarizePerDay(userItems: List<WorklogItem>): List<SecondsLoggedOnDateDto> {
        return userItems
                .groupBy { it.date }
                .mapValues { it.value.map { it.secondsLogged }.sum() }
                .map { SecondsLoggedOnDateDto(it.key, it.value) }
                .sortedBy { it.date }
    }
}