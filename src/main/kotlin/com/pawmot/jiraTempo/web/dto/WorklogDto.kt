package com.pawmot.jiraTempo.web.dto

import java.time.LocalDate

data class WorklogDto(val start: LocalDate, val end: LocalDate, val personalWorklogs: List<PersonalWorklogDto>)
data class PersonalWorklogDto(val userName: String, val issues: List<IssueWorklogDto>, val summary: List<DateHoursDto>)
data class IssueWorklogDto(val key: String, val hours: List<DateHoursDto>)
data class DateHoursDto(val date: LocalDate, val hours: String)