package com.pawmot.jiraTempo.domain.settings

import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface SettingsRepository : ReactiveMongoRepository<Settings, ObjectId>