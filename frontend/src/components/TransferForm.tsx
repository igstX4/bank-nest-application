import { useState } from 'react';

type Props = {
	onSubmit?: (v: { recipientEmail: string; currency: 'USD' | 'EUR'; amount: number }) => Promise<void> | void;
};

export function TransferForm({ onSubmit }: Props) {
	const [recipientEmail, setRecipientEmail] = useState('');
	const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
	const [amount, setAmount] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!onSubmit) return;
		setLoading(true);
		try {
			await onSubmit({ recipientEmail, currency, amount: Number(amount) });
			setAmount('');
			setRecipientEmail('');
		} finally {
			setLoading(false);
		}
	}

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="sm:col-span-2">
					<label className="mb-1 block text-sm text-gray-700">Recipient email</label>
					<input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="w-full rounded-md border px-3 py-2 outline-none focus:ring" placeholder="recipient@example.com" />
				</div>
				<div>
					<label className="mb-1 block text-sm text-gray-700">Currency</label>
					<select value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="w-full rounded-md border px-3 py-2">
						<option>USD</option>
						<option>EUR</option>
					</select>
				</div>
				<div>
					<label className="mb-1 block text-sm text-gray-700">Amount</label>
					<input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="0.00" />
				</div>
			</div>
			<button disabled={loading} className="rounded-md bg-gray-900 px-4 py-2 text-white">{loading ? 'Sending...' : 'Send'}</button>
		</form>
	);
}
