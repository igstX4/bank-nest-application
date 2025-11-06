import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { UsersRepository } from './users.repository';
import { jwtConfigFactory } from '../config/jwt.config';
import { AccountsRepository } from '../accounts/accounts.repository';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfigFactory,
    }),
  ],
  providers: [AuthService, JwtStrategy, UsersRepository, AccountsRepository],
  controllers: [AuthController],
  exports: [AuthService, UsersRepository],
})
export class AuthModule {}


