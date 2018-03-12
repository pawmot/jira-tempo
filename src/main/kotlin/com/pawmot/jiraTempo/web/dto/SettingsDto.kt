package com.pawmot.jiraTempo.web.dto

data class SettingsDto(val jiraUrl: String?, val user: JiraUserDto?)
data class JiraUserDto(val login: String, val password: String)