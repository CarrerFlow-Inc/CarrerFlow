import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Habilita CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  });

  //Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Exception filter global
  app.useGlobalFilters(new AllExceptionsFilter());

  //Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('CarrerFlow API')
    .setDescription(
      'API REST para gerenciamento de candidaturas de emprego.\n\n' +
      '## Sobre o Projeto\n' +
      'CarrerFlow é uma plataforma web desenvolvida para permitir que candidatos cadastrem, ' +
      'visualizem e gerenciem suas candidaturas de emprego em um único local centralizado.\n\n' +
      '## Versão MVP\n' +
      'Esta é a versão MVP simplificada focada exclusivamente no CRUD de candidaturas. ' +
      'A autenticação será implementada nas próximas sprints.\n\n' +
      '## Equipe\n' +
      '- Product Owner: Evellyn\n' +
      '- Scrum Master: Italo\n' +
      '- Desenvolvedores: Victor, Juarez, Carlos Eduardo, Erick, Eleonora\n' +
      '- DBA: Anderson'
    )
    .setVersion('1.0.0')
    .addTag('applications', 'Endpoints para gerenciamento de candidaturas')
    .addTag('dashboard', 'Endpoints para estatísticas e dashboard')
    .addTag('utilities', 'Endpoints auxiliares')
    .setContact(
      'Equipe CarrerFlow',
      'https://github.com/seu-repo/carrerflow',
      'contato@carrerflow.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Desenvolvimento Local')
    .addServer('https://api.carrerflow.com', 'Produção')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'CarrerFlow API - Documentação',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #2196F3 }
    `,
  });

  //Inicia a aplicação na porta definida no .env ou na 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
