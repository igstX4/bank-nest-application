import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepo: AccountsRepository) {}

  async listByUser(userId: number): Promise<Account[]> {
    return this.accountsRepo.findByUser(userId);
  }

  async getBalanceForUserAccount(userId: number, accountId: number) {
    const account = await this.accountsRepo.findById(accountId);
    if (!account || account.userId !== userId) {
      return null;
    }
    return { accountId: account.id, currency: account.currency, balance: account.balance };
  }
}



