FROM pawmot/server-jre:10-debian
ADD app.jar app.jar
ADD dist /dist
ENTRYPOINT ["java", "-jar", "app.jar"]
