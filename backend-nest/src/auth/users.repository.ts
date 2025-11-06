import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password: string }) {
    return this.prisma.user.create({ data });
  }

  async createInTx(tx: Prisma.TransactionClient, data: { email: string; password: string }) {
    return tx.user.create({ data });
  }
}


