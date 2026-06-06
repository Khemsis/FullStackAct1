# Usamos una imagen de Java 17
FROM eclipse-temurin:17-jdk-alpine
# Copiamos el archivo .jar que Maven genera
COPY target/*.jar app.jar
# Ejecutamos la aplicación
ENTRYPOINT ["java","-jar","/app.jar"]