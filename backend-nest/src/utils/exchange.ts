import { toDecimalString2 } from './money';

export function computeExchange(fromCurrency: 'USD' | 'EUR', amount: number, rate: number) {
	const toCurrency: 'USD' | 'EUR' = fromCurrency === 'USD' ? 'EUR' : 'USD';
	const amountToNum = fromCurrency === 'USD' ? amount * rate : amount / rate;
	return {
		toCurrency,
		amountFromStr: toDecimalString2(amount),
		amountToStr: toDecimalString2(amountToNum),
	};
}
