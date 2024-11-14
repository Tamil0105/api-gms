import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Create a cached Express server instance
const server = express();
server.use(express.json()); // Parse JSON bodies
let isAppInitialized = false;

// Initialize the NestJS app within an Express server instance
async function createApp() {
  if (!isAppInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    isAppInitialized = true;
    console.log('NestJS application initialized');
  } else {
    console.log('NestJS application is already running');
  }
  return server;
}

// Vercel serverless function entry point
export default async (req: express.Request, res: express.Response) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  console.log('Request body:', req.body);

  const app = await createApp();
  app(req, res);
};
