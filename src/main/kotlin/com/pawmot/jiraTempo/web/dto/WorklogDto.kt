package com.pawmot.jiraTempo.web.dto

import java.time.LocalDate

data class WorklogDto(val start: LocalDate, val end: LocalDate, val personalWorklogs: List<PersonalWorklogDto>)
data class PersonalWorklogDto(val userName: String, val issues: List<IssueWorklogDto>)
data class IssueWorklogDto(val key: String, val loggedTime: List<SecondsLoggedOnDateDto>, val url: String)
data class SecondsLoggedOnDateDto(val date: LocalDate, val seconds: Int)