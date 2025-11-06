import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionsRepository } from './transactions.repository';
import { LedgerRepository } from '../ledger/ledger.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { UsersRepository } from '../auth/users.repository';
import { USD_TO_EUR_RATE } from '../config/constants';
import { toDecimalString2, negateAmountStr } from '../utils/money';
import { computeExchange } from '../utils/exchange';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class TransactionsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly txRepo: TransactionsRepository,
		private readonly ledgerRepo: LedgerRepository,
		private readonly accountsRepo: AccountsRepository,
		private readonly usersRepo: UsersRepository,
		private readonly realtime: RealtimeGateway,
	) {}

	async transfer(senderUserId: number, recipientEmail: string, currency: 'USD' | 'EUR', amountNum: number) {
		if (amountNum <= 0) throw new BadRequestException('Amount must be positive');
		const amount = toDecimalString2(amountNum);

		// accounts checking
		const [senderAccounts, recipientUser] = await Promise.all([
			this.accountsRepo.findByUser(senderUserId),
			this.usersRepo.findByEmail(recipientEmail),
		]);
		if (!recipientUser) throw new NotFoundException('Recipient not found');
		const sender = senderAccounts.find((a) => a.currency === currency);
		if (!sender) throw new NotFoundException('Sender account not found');
		const recipientAccounts = await this.accountsRepo.findByUser(recipientUser.id);
		const recipient = recipientAccounts.find((a) => a.currency === currency);
		if (!recipient) throw new NotFoundException('Recipient account not found');

		return this.prisma.$transaction(async (tx) => {
			const tr = await this.txRepo.createInTx(tx, { type: 'transfer', userId: senderUserId, amount });

			const dec = await this.accountsRepo.decrementBalanceInTx(tx, sender.id, amount);
			if (dec.count !== 1) throw new BadRequestException('Insufficient funds');

			await this.accountsRepo.incrementBalanceInTx(tx, recipient.id, amount);

			await this.ledgerRepo.createEntriesInTx(tx, tr.id, [
				{ accountId: sender.id, amount: negateAmountStr(amount), description: 'transfer out' },
				{ accountId: recipient.id, amount: amount, description: 'transfer in' },
			]);

			// realtime notifications
			this.realtime.notifyUser(recipient.userId, 'accounts.updated', {});

			return { id: tr.id, type: tr.type, createdAt: tr.createdAt };
		});
	}

	async exchange(userId: number, fromCurrency: 'USD' | 'EUR', amountNum: number) {
		if (amountNum <= 0) throw new BadRequestException('Amount must be positive');
		const { toCurrency, amountFromStr, amountToStr } = computeExchange(fromCurrency, amountNum, USD_TO_EUR_RATE);

		const accounts = await this.accountsRepo.findByUser(userId);
		const fromAcc = accounts.find((a) => a.currency === fromCurrency);
		const toAcc = accounts.find((a) => a.currency === toCurrency);
		if (!fromAcc || !toAcc) throw new NotFoundException('Accounts not found');

		return this.prisma.$transaction(async (tx) => {
			const tr = await this.txRepo.createInTx(tx, { type: 'exchange', userId, amount: amountFromStr });

			const dec = await this.accountsRepo.decrementBalanceInTx(tx, fromAcc.id, amountFromStr);
			if (dec.count !== 1) throw new BadRequestException('Insufficient funds');

			await this.accountsRepo.incrementBalanceInTx(tx, toAcc.id, amountToStr);

			await this.ledgerRepo.createEntriesInTx(tx, tr.id, [
				{ accountId: fromAcc.id, amount: negateAmountStr(amountFromStr), description: 'exchange out' },
				{ accountId: toAcc.id, amount: amountToStr, description: 'exchange in' },
			]);

			// realtime notifications
			// this.realtime.notifyUser(userId, 'accounts.updated', {});

			return { id: tr.id, type: tr.type, createdAt: tr.createdAt };
		});
	}

	async list(userId: number, type: string | undefined, page = 1, limit = 20) {
		if (page < 1) page = 1;
		if (limit < 1) limit = 20;
		return this.txRepo.listByUser(userId, type, page, limit);
	}
}


