export function toDecimalString2(n: number): string {
	return (Math.round(n * 100) / 100).toFixed(2);
}

export function negateAmountStr(amountStr: string): string {
	if (amountStr.startsWith('-')) return amountStr;
	return `-${amountStr}`;
}
