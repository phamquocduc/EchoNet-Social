import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as proxy from 'express-http-proxy'
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { AuthMiddleware } from './auth/midleware/authentication.midleware';
import { AuthenticationService } from './auth/authentication.services';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const identityService = app.get('IDENTITY_SERVICE');
  const authService = app.get(AuthenticationService);

  const authMiddleware = new AuthMiddleware(identityService, authService);

  app.use('/identity', authMiddleware.use.bind(authMiddleware), proxy(process.env.IDENTITY_PROXY || 'http://localhost:3001'));

  app.use('/profile', authMiddleware.use.bind(authMiddleware), proxy(process.env.PROFILE_PROXY || 'http://localhost:3002'));

  app.use('/feed', authMiddleware.use.bind(authMiddleware), proxy(process.env.POST_PROXY || 'http://localhost:3003', {
    proxyReqBodyDecorator: (bodyContent, srcReq) => bodyContent,
    limit: '20mb',
  }));

  const swaggerDocument = yaml.load(fs.readFileSync('api-document/echonet-api-doc.yaml', 'utf8')) as OpenAPIObject;

  SwaggerModule.setup('api-docs', app, swaggerDocument);

  await app.listen(Number(process.env.PORT));
}
bootstrap();
