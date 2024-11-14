// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// const { createServer } = require('@vercel/node');

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule,{cors:true});
//   app.enableCors({
//     origin: '*', // Allow all origins (You can specify allowed origins instead)
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type, Accept, Authorization',
//   });
//   const config = new DocumentBuilder()
//   .setTitle('Todo REST API')
//   .setDescription("A rest api to list user's todos/tasks, authorization implemented using JWT token. THe API is made using NestJs.")
//   .setVersion('1.0')
//   .addBearerAuth()
//   .build();
// const document = SwaggerModule.createDocument(app, config);
// SwaggerModule.setup('/swagger', app, document, {
//     customCssUrl:
//       'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
//     customJs: [
//       'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
//       'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
//     ],
// })
//   await app.listen(8080);
//   console.log("server running 8080")
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp = null;

async function createApp() {
  const server = express();  // Create an Express instance
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();  // Enable CORS for API calls
  app.useGlobalPipes(new ValidationPipe());  // Set up global validation
  await app.init();  // Initialize the app
  return server;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  return cachedApp(req, res);  // Forward the request to the initialized server
};

