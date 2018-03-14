package com.pawmot.jiraTempo.domain.settings

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Version
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class Settings(@Id var id: ObjectId?, var jiraUrl: String, var login: String, var password: String, @Version var version: Long?)