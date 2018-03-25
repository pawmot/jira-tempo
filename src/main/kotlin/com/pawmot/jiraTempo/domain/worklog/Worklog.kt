package com.pawmot.jiraTempo.domain.worklog

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDate

@Document
data class Worklog(@Id var id: ObjectId? = null,
                   var startDate: LocalDate,
                   var endDate: LocalDate,
                   var items: List<WorklogItem>)

data class WorklogItem(var date: LocalDate,
                       var secondsLogged: Int,
                       var user: String,
                       var issueKey: String)

