# Use JDK 23 on Alpine Linux as a base image
FROM openjdk:23-slim AS build
# Build argument to specify the JAR file path (from Gradle build output)
ARG JAR_FILE=build/libs/*.jar

# Copy the JAR file from the local build context into the container
COPY ${JAR_FILE} app.jar

# Expose the application's port (change if necessary)
EXPOSE 8080

# Entry point to run the application using the JAR file
ENTRYPOINT ["java", "-jar", "/app.jar"]
