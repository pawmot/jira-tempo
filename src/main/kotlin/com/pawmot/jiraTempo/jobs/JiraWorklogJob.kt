package com.pawmot.jiraTempo.jobs

import com.pawmot.jiraTempo.domain.settings.SettingsRepository
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
                    val deleteAll = repository.deleteAll()
                    deleteAll.doOnSuccess {
                        worklogs.doOnNext({log.info(it.toString())})
                        repository.saveAll(worklogs)
                                .subscribe()
                    }.subscribe()
                }
    }
}