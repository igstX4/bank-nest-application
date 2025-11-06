import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import type { AuthenticatedRequest } from '../types/authenticated-request';
import { TransferDto } from './dto/transfer.dto';
import { ExchangeDto } from './dto/exchange.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post('transfer')
  async transfer(@Req() req: AuthenticatedRequest, @Body() body: TransferDto) {
    const userId = req.user!.sub;
    return this.service.transfer(userId, body.recipientEmail, body.currency, body.amount);
  }

  @Post('exchange')
  async exchange(@Req() req: AuthenticatedRequest, @Body() body: ExchangeDto) {
    const userId = req.user!.sub;
    return this.service.exchange(userId, body.fromCurrency, body.amount);
  }

  @Get()
  async list(
    @Req() req: AuthenticatedRequest,
    @Query('type') type?: 'transfer' | 'exchange',
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const userId = req.user!.sub;
    return this.service.list(userId, type, Number(page), Number(limit));
  }
}


