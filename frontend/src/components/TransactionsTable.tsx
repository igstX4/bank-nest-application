type Tx = { id: number; type: 'transfer' | 'exchange'; amount: string; date: string };

export function TransactionsTable({ items = [] as Tx[] }: { items?: Tx[] }) {
	return (
		<div className="overflow-hidden rounded-lg border bg-white shadow-sm">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
						<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
						<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 bg-white">
					{items.length === 0 ? (
						<tr>
							<td className="px-4 py-4 text-gray-500" colSpan={3}>No transactions yet</td>
						</tr>
					) : (
						items.map((tx) => (
							<tr key={tx.id}>
								<td className="px-4 py-3 capitalize">{tx.type}</td>
								<td className="px-4 py-3">{tx.amount}</td>
								<td className="px-4 py-3 text-sm text-gray-600">{tx.date}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
