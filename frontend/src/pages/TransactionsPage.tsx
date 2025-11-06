import { useState } from 'react';
import { TransactionsTable } from '../components/TransactionsTable';
import { useTransactions } from '../lib/hooks';

export function TransactionsPage() {
	const [type, setType] = useState<'' | 'transfer' | 'exchange'>('');
	const [page, setPage] = useState(1);
	const { data } = useTransactions({ type: type || undefined, page, limit: 10 });
	const total = data?.total ?? 0;
	const limit = data?.limit ?? 10;
	const maxPage = Math.max(1, Math.ceil(total / limit));

	return (
		<div className="space-y-6">
			<div className="flex items-end justify-between gap-4">
				<div className="flex gap-3">
					<div>
						<label className="mb-1 block text-sm text-gray-700">Type</label>
						<select value={type} onChange={(e) => { setPage(1); setType(e.target.value as any); }} className="rounded-md border px-3 py-2">
							<option value="">All</option>
							<option value="transfer">Transfer</option>
							<option value="exchange">Exchange</option>
						</select>
					</div>
				</div>
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<button disabled={page<=1} onClick={() => setPage((p) => Math.max(1, p-1))} className="rounded-md border px-3 py-1.5">Prev</button>
					<span>Page {page} of {maxPage}</span>
					<button disabled={page>=maxPage} onClick={() => setPage((p) => p+1)} className="rounded-md border px-3 py-1.5">Next</button>
				</div>
			</div>
			<TransactionsTable items={data?.items?.map((t: any) => ({ id: t.id, type: t.type, amount: t.amount, date: new Date(t.createdAt).toLocaleString() }))} />
		</div>
	);
}
