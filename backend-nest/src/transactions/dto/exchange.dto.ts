import { IsIn, IsNumber, Min } from 'class-validator';

export class ExchangeDto {
  @IsIn(['USD', 'EUR'])
  fromCurrency!: 'USD' | 'EUR';

  @IsNumber()
  @Min(0.01)
  amount!: number;
}


