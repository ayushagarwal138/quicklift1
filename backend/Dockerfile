FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/quicklift-backend-0.0.1-SNAPSHOT.jar app.jar
RUN addgroup --system quicklift && adduser --system --ingroup quicklift quicklift
USER quicklift
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
