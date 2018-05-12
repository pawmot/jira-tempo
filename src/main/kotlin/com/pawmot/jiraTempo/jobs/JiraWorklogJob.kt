package com.pawmot.jiraTempo.jobs

import com.pawmot.jiraTempo.domain.settings.SettingsRepository
import com.pawmot.jiraTempo.domain.worklog.UnsupportedMediaType
import com.pawmot.jiraTempo.domain.worklog.WorklogFactory
import com.pawmot.jiraTempo.domain.worklog.WorklogRepository
import org.jasypt.util.text.TextEncryptor
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class JiraWorklogJob(private val repository: WorklogRepository,
                     private val settingsRepository: SettingsRepository,
                     private val encryptor: TextEncryptor) {

    companion object {
        private val log = LoggerFactory.getLogger(JiraWorklogJob::class.java)
    }

    @Scheduled(cron = "\${jiraTempo.tempoRefreshCron}")
    fun refreshWorklog() {
        settingsRepository.findAll().singleOrEmpty()
                .subscribe {
                    log.debug("$it")
                    val pass = encryptor.decrypt(it.password)

                    val factory = WorklogFactory.create(it.jiraUrl, it.login, pass)
                    val worklogs = factory.createWorklogsFor(it.periods, it.projects, it.users)
                    worklogs.collectList()
                            .doOnError {
                                when (it) {
                                    is UnsupportedMediaType -> log.error("Got unsupported media type: ${it.mediaType}")
                                    is RuntimeException -> log.error("Exception:", it)
                                }
                            }
                            .subscribe { ws ->
                                log.debug("Successfully got worklogs: $ws")
                                val deleteAll = repository.deleteAll()
                                deleteAll.doOnSuccess {
                                    repository.saveAll(ws)
                                            .subscribe()
                                }.subscribe()
                            }
                }
    }
}