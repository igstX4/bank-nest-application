import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class LedgerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createEntriesInTx(
    tx: Prisma.TransactionClient,
    transactionId: number,
    entries: Array<{ accountId: number; amount: string; description?: string }>,
  ) {
    return tx.ledgerEntry.createMany({
      data: entries.map((e) => ({
        transactionId,
        accountId: e.accountId,
        amount: e.amount as any,
        description: e.description,
      })),
    });
  }
}


