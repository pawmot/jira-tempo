package com.pawmot.jiraTempo.domain

import com.pawmot.jiraTempo.domain.settings.WorklogPeriod
import com.pawmot.jiraTempo.domain.worklog.WorklogFactory
import org.junit.jupiter.api.Test
import java.time.LocalDate

class WorklogFactoryTest {

    @Test
    fun test() {
        val fac = WorklogFactory.create("https://jira.ista.net","motylpa", "JT6q!37O^PYPahh4kFP4")
        val worklogs = fac.createWorklogsFor(
                listOf(WorklogPeriod(LocalDate.of(2018, 1, 1), LocalDate.of(2018, 1, 14))),
                listOf("DSL", "WNAP", "IBM"),
                listOf("motylpa", "cmielpa", "kokoszlu"))

        worklogs.subscribe {
            print(it)
        }
    }
}