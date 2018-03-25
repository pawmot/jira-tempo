package com.pawmot.jiraTempo.domain.worklog

import com.fasterxml.jackson.annotation.JsonFormat
import com.pawmot.jiraTempo.domain.settings.WorklogPeriod
import com.pawmot.jiraTempo.jobs.JiraWorklogJob
import org.slf4j.LoggerFactory
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.OffsetDateTime
import java.util.*

class WorklogFactory private constructor(private val client: WebClient) {
    companion object {
        fun create(jiraUrl: String, login: String, password: String): WorklogFactory {
            val auth = "$login:$password"
            val base64Auth = Base64.getEncoder().encodeToString(auth.toByteArray())

            val client = WebClient.builder()
                    .baseUrl("$jiraUrl/rest/api/2")
                    .defaultHeader("Authorization", "Basic $base64Auth")
                    .build()

            return WorklogFactory(client)
        }

        private val log = LoggerFactory.getLogger(JiraWorklogJob::class.java)
    }

    fun createWorklogsFor(periods: List<WorklogPeriod>, projects: List<String>, users: List<String>): Flux<Worklog> =
            Flux.fromIterable(periods)
                    .flatMap { PeriodProcess(client, it, projects, users).run() }

    private class PeriodProcess(private val client: WebClient,
                                private val period: WorklogPeriod,
                                private val projects: List<String>,
                                private val users: List<String>) {

        fun run(): Mono<Worklog> {
            return getIssues()
                    .flatMap(this::getWorklogItems)
                    .collectList()
                    .map { Worklog(startDate = period.start, endDate = period.end, items = it) }
        }

        private fun getIssues(): Flux<JiraIssue> {
            // TODO load issues with > 20 worklogs using separate API call
            return client.post()
                    .uri("/search")
                    .syncBody(JiraSearchRequest(createJql(period, projects, users), 0, 200, listOf("worklog")))
                    .exchange()
                    .flatMap { it.bodyToMono(JiraSearchResponse::class.java) }
                    .flatMapIterable { it.issues }
        }

        private fun getWorklogItems(issue: JiraIssue): Flux<WorklogItem> {
            val key = issue.key
            return Flux.fromIterable(issue.fields.worklog.worklogs)
                    .map { WorklogItem(it.started.toLocalDate(), it.timeSpentSeconds, it.author.name, key) }
                    .filter { period.contains(it.date) && it.user in users }
        }

        private fun createJql(period: WorklogPeriod,
                              projects: List<String>,
                              users: List<String>): String {
            val jql = "project in (${projects.joinToString()}) AND " +
                    "worklogDate >= ${period.start} AND worklogDate <= ${period.end} AND " +
                    "worklogAuthor in (${users.joinToString()})"

            log.info("Using JQL $jql")

            return jql
        }
    }
}

private data class JiraSearchRequest(val jql: String, val startAt: Int, val maxResults: Int, val fields: List<String>)
private data class JiraSearchResponse(val total: Int, val issues: List<JiraIssue>)
private data class JiraIssue(val key: String, val fields: JiraIssueFields)
private data class JiraIssueFields(val worklog: JiraIssueWorklogField)
private data class JiraIssueWorklogField(val startAt: Int, val maxResults: Int, val total: Int, val worklogs: List<JiraIssueWorklogFieldWorklog>)
private data class JiraIssueWorklogFieldWorklog(val author: JiraIssueWorklogFieldWorklogAuthor, val timeSpentSeconds: Int, @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ") val started: OffsetDateTime)
private data class JiraIssueWorklogFieldWorklogAuthor(val name: String)

//        client.get()
//                .uri("/issue/DSL-88?fields=summary")
//                .accept(MediaType.APPLICATION_JSON)
//                .exchange()
//                .flatMap { it.bodyToMono(JiraIssue::class.java) }
//                .subscribe({
//                    println(it.key)
//                })