package com.pawmot.jiraTempo.domain.worklog

import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface WorklogRepository : ReactiveMongoRepository<Worklog, ObjectId>
