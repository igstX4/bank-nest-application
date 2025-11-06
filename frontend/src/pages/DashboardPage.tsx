import { BalanceCard } from '../components/BalanceCard';
import { TransferForm } from '../components/TransferForm';
import { ExchangeForm } from '../components/ExchangeForm';
import { TransactionsTable } from '../components/TransactionsTable';
import { useAccounts, useExchange, useTransactions, useTransfer } from '../lib/hooks';

export function DashboardPage() {
	const { data: accounts } = useAccounts();
	const { data: txList } = useTransactions({ page: 1, limit: 5 });
	const transfer = useTransfer();
	const exchange = useExchange();

	return (
		<div className="space-y-8">
			<section>
				<h2 className="mb-3 text-lg font-semibold">Balances</h2>
				<div className="grid gap-4 sm:grid-cols-2">
					<BalanceCard currency="USD" amount={formatAmount(accounts, 'USD')} />
					<BalanceCard currency="EUR" amount={formatAmount(accounts, 'EUR')} />
				</div>
			</section>
			<section className="grid gap-8 md:grid-cols-2">
				<div>
					<h3 className="mb-3 text-base font-semibold">Transfer</h3>
					<TransferForm onSubmit={async (v) => { await transfer.mutateAsync(v); }} />
				</div>
				<div>
					<h3 className="mb-3 text-base font-semibold">Exchange</h3>
					<ExchangeForm onSubmit={async (v) => { await exchange.mutateAsync(v); }} />
				</div>
			</section>
			<section>
				<h3 className="mb-3 text-base font-semibold">Last transactions</h3>
				<TransactionsTable items={txList?.items?.map((t: any) => ({ id: t.id, type: t.type, amount: t.amount, date: new Date(t.createdAt).toLocaleString() }))} />
			</section>
		</div>
	);
}

function formatAmount(accounts: any, currency: 'USD' | 'EUR') {
	const acc = (accounts as any[])?.find((a) => a.currency === currency);
	if (!acc) return currency === 'USD' ? '$0.00' : '€0.00';
	return currency === 'USD' ? `$${acc.balance}` : `€${acc.balance}`;
}
