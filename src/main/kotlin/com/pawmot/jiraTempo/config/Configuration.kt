package com.pawmot.jiraTempo.config

import org.jasypt.util.text.StrongTextEncryptor
import org.jasypt.util.text.TextEncryptor
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class Configuration {

    @Bean
    fun textEncryptor(@Value("\${encrypt.secret}") secret: String): TextEncryptor {
        val encryptor = StrongTextEncryptor()
        encryptor.setPassword(secret)
        return encryptor
    }
}
