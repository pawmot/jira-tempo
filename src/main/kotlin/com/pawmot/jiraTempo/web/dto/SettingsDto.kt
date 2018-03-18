package com.pawmot.jiraTempo.web.dto

data class SaveSettingsDto(val jiraUrl: String?, val user: SaveJiraUserDto?, val version: Long?)
data class SaveJiraUserDto(val login: String, val password: String)

data class ReadSettingsDto(val jiraUrl: String?, val user: ReadJiraUserDto?, val version: Long?)
data class ReadJiraUserDto(val login: String)