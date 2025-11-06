import { IsEmail, IsIn, IsNumber, Min } from 'class-validator';

export class TransferDto {
  @IsEmail()
  recipientEmail!: string;

  @IsIn(['USD', 'EUR'])
  currency!: 'USD' | 'EUR';

  @IsNumber()
  @Min(0.01)
  amount!: number;
}


