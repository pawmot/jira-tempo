package com.pawmot.jiraTempo.web.dto

import java.time.LocalDate

data class SaveSettingsDto(val jiraUrl: String?,
                           val user: SaveJiraUserDto?,
                           val periods: List<WorklogPeriodDto>,
                           val projects: List<String>,
                           val users: List<String>,
                           val version: Long?)

data class SaveJiraUserDto(val login: String, val password: String)

data class ReadSettingsDto(val jiraUrl: String?,
                           val user: ReadJiraUserDto?,
                           val periods: List<WorklogPeriodDto>,
                           val projects: List<String>,
                           val users: List<String>,
                           val version: Long?)
data class ReadJiraUserDto(val login: String)

data class WorklogPeriodDto(val start: LocalDate, val end: LocalDate)