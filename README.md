<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Orders-microservice

1. Clonar reositorio
2. Inatalar las dependencias con  `npm install`.
3. Crear un archivo `.env` y copiar lo que hay en el `.env.template`
4. Ejecutar migracion de prima `npx prisma migrate dev`
5. Levantar la base de datos con `docker compose up -d`
6. Levantar el servidor de NATS
```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```
7. Ejecutar la aplicacion con `npm run start:dev`