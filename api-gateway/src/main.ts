import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as proxy from 'express-http-proxy'
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { AuthMiddleware } from './auth/midleware/authentication.midleware';
import { AuthenticationService } from './auth/authentication.services';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const identityService = app.get('IDENTITY_SERVICE'); // Lấy service Identity từ DI container
  const authService = app.get(AuthenticationService); // Lấy AuthService

  const authMiddleware = new AuthMiddleware(identityService, authService);

  app.use('/identity', authMiddleware.use.bind(authMiddleware), proxy('http://localhost:3001'));  

  app.use('/profile', authMiddleware.use.bind(authMiddleware), proxy('http://localhost:3002'));

  // app.use('/profile', proxy('http://localhost:3002'));  
  app.use('/post', proxy('http://localhost:3003'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
