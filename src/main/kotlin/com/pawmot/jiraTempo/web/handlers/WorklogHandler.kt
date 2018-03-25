package com.pawmot.jiraTempo.web.handlers

import com.pawmot.jiraTempo.domain.settings.SettingsRepository
import com.pawmot.jiraTempo.domain.worklog.WorklogItem
import com.pawmot.jiraTempo.domain.worklog.WorklogRepository
import com.pawmot.jiraTempo.web.dto.DateHoursDto
import com.pawmot.jiraTempo.web.dto.IssueWorklogDto
import com.pawmot.jiraTempo.web.dto.PersonalWorklogDto
import com.pawmot.jiraTempo.web.dto.WorklogDto
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.body
import reactor.core.publisher.Mono

@Service
class WorklogHandler(private val worklogRepository: WorklogRepository, private val settingsRepository: SettingsRepository) {

    fun get(req: ServerRequest): Mono<ServerResponse> {
        return ServerResponse.ok().body(
                settingsRepository.findAll().singleOrEmpty()
                        .map { it.users }
                        .flatMapMany { users ->
                            worklogRepository.findAll()
                                    .map { WorklogDto(it.startDate, it.endDate, createPersonalWorklogs(users, it.items)) }
                        })
    }

    private fun createPersonalWorklogs(users: List<String>, items: List<WorklogItem>): List<PersonalWorklogDto> {
        return users.map { user ->
            val userItems = items.filter { it.user == user }

            val summary = summarize(userItems)

            val byIssue = userItems
                    .groupBy { it.issueKey }
                    .mapValues { summarize(it.value) }
                    .map { IssueWorklogDto(it.key, it.value) }
                    .sortedBy { it.hours.map { it.date }.min() }

            PersonalWorklogDto(user, byIssue, summary)
        }
                .sortedBy { it.userName  }
    }

    private fun summarize(userItems: List<WorklogItem>): List<DateHoursDto> {
        return userItems
                .groupBy { it.date }
                .mapValues { it.value.map { it.secondsLogged }.sum() }
                .map { DateHoursDto(it.key, it.value.toHMString()) }
                .sortedBy { it.date }
    }

    private fun Int.toHMString(): String {
        val hours = this / 3600
        val minutes = (this / 60 - hours * 60)

        return "${hours}h ${minutes}m"
    }
}