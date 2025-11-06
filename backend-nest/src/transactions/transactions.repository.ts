import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createInTx(tx: Prisma.TransactionClient, data: { type: string; userId: number; amount: string }) {
    return tx.transaction.create({ data });
  }

  async listByUser(userId: number, type: string | undefined, page: number, limit: number) {
    const where: any = { userId };
    if (type) where.type = type;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);
    return { items, total, page, limit };
  }
}


