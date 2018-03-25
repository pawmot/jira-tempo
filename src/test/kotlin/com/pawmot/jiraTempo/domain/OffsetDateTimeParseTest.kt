package com.pawmot.jiraTempo.domain

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.*
import java.time.format.DateTimeFormatter

class OffsetDateTimeParseTest {

    @Test
    fun test() {
        val d = OffsetDateTime.parse("2018-01-08T14:22:00.000+01:00")
        assertThat(d).isEqualTo(
                OffsetDateTime.of(
                        LocalDateTime.of(
                                LocalDate.of(2018, 1, 8),
                                LocalTime.of(14, 22 ,0)),
                        ZoneOffset.ofHours(1)))
    }
}