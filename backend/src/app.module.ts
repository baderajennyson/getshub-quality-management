import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ProvisionsModule } from './provisions/provisions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || 'getshub_user',
      password: process.env.DB_PASSWORD || 'getshub_pass',
      database: process.env.DB_NAME || 'getshub_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Back to working state
      logging: false,
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    ProvisionsModule,
  ],
})
export class AppModule {}