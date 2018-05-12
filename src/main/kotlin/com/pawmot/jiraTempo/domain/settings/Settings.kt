package com.pawmot.jiraTempo.domain.settings

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Version
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDate

@Document
data class Settings(@Id var id: ObjectId?,
                    var jiraUrl: String,
                    var login: String,
                    var password: String,
                    var periods: List<WorklogPeriod>,
                    var projects: List<String>,
                    var users: List<String>,
                    @Version var version: Long?) {
    init {
        users = users.map { it.toLowerCase() }
        periods = periods.sortedBy { it.start }
    }
}

data class WorklogPeriod(var start: LocalDate, var end: LocalDate) {
    fun contains(date: LocalDate): Boolean {
        return (date.isEqual(start) || date.isAfter(start)) &&
                (date.isBefore(end) || date.isEqual(end))
    }
}