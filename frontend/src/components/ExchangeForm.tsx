import { useState } from 'react';

type Props = {
	onSubmit?: (v: { fromCurrency: 'USD' | 'EUR'; amount: number }) => Promise<void> | void;
};

export function ExchangeForm({ onSubmit }: Props) {
	const [fromCurrency, setFromCurrency] = useState<'USD' | 'EUR'>('USD');
	const [amount, setAmount] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!onSubmit) return;
		setLoading(true);
		try {
			await onSubmit({ fromCurrency, amount: Number(amount) });
			setAmount('');
		} finally {
			setLoading(false);
		}
	}

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<label className="mb-1 block text-sm text-gray-700">From currency</label>
					<select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value as any)} className="w-full rounded-md border px-3 py-2">
						<option>USD</option>
						<option>EUR</option>
					</select>
				</div>
				<div>
					<label className="mb-1 block text-sm text-gray-700">Amount</label>
					<input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="0.00" />
				</div>
			</div>
			<div className="text-sm text-gray-600">Rate: 1 USD = 0.92 EUR</div>
			<button disabled={loading} className="rounded-md bg-gray-900 px-4 py-2 text-white">{loading ? 'Exchanging...' : 'Exchange'}</button>
		</form>
	);
}
