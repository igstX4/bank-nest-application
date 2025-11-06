import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account } from '@prisma/client';
import type { Prisma } from '@prisma/client';

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: number): Promise<Account[]> {
    return this.prisma.account.findMany({ where: { userId } });
  }

  async updateBalance(accountId: number, newBalance: string): Promise<Account> {
    return this.prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance as any },
    });
  }

  async createManyInTx(tx: Prisma.TransactionClient, data: Array<{ userId: number; currency: string; balance: string }>) {
    return tx.account.createMany({ data });
  }

  async findById(accountId: number): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: { id: accountId } });
  }

  async decrementBalanceInTx(tx: Prisma.TransactionClient, accountId: number, amount: string): Promise<{ count: number }> {
    // raw sql

    const result = await (tx as any).$executeRaw`
      UPDATE "Account"
      SET balance = balance - ${amount}::DECIMAL(10,2)
      WHERE id = ${accountId} AND balance >= ${amount}::DECIMAL(10,2)
    `;
    return { count: result };
  }

  async incrementBalanceInTx(tx: Prisma.TransactionClient, accountId: number, amount: string): Promise<Account> {
    return tx.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount as any } },
    });
  }
}



