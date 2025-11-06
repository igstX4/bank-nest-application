import { Controller, Get, Param, ParseIntPipe, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import type { AuthenticatedRequest } from '../types/authenticated-request';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub as number;
    return this.accountsService.listByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/balance')
  async balance(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.sub as number;
    const result = await this.accountsService.getBalanceForUserAccount(userId, id);
    if (!result) {
      throw new NotFoundException('Account not found');
    }
    return result;
  }
}



