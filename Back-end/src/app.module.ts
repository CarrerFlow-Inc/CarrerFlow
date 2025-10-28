import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CandidaturasModule } from './candidaturas/candidaturas.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'carrerflow.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, //APENAS PARA DESENVOLVIMENTO
      logging: false,
    }),
    AuthModule,
    CandidaturasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
