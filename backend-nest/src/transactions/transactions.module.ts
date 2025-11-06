import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { LedgerRepository } from '../ledger/ledger.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, RealtimeModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository, LedgerRepository, AccountsRepository],
})
export class TransactionsModule {}


