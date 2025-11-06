import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../config/constants';
import { AccountsRepository } from '../accounts/accounts.repository';
import { Currency } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly accountsRepo: AccountsRepository,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.usersRepo.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    return this.prisma.$transaction(async (tx) => {
      const user = await this.usersRepo.createInTx(tx, { email, password: hash });

      await this.accountsRepo.createManyInTx(tx, [
        { userId: user.id, currency: Currency.USD, balance: '1000.00' },
        { userId: user.id, currency: Currency.EUR, balance: '500.00' },
      ]);
      const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
      return { token };
    });
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(password, (user as any).password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.jwt.signAsync({ sub: (user as any).id, email: (user as any).email });
    return { token };
  }
}


