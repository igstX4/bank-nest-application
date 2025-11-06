type Props = { currency: 'USD' | 'EUR'; amount: string };

export function BalanceCard({ currency, amount }: Props) {
	return (
		<div className="rounded-lg border bg-white p-4 shadow-sm">
			<div className="text-sm text-gray-600">{currency} Balance</div>
			<div className="mt-2 text-2xl font-semibold">{amount}</div>
		</div>
	);
}
