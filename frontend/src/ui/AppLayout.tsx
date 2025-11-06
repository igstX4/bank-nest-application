import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { useMe } from '../lib/hooks';

export function AppLayout() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const token = useAuthStore((s) => s.token);
	const user = useAuthStore((s) => s.user);
	const logout = useAuthStore((s) => s.logout);
	const { isLoading: meLoading } = useMe();

	useEffect(() => {
		if (!token) navigate('/login');
	}, [token, navigate]);

	// Показываем loader при проверке токена/загрузке пользователя
	if (!token || meLoading) {
		return (
			<div className="min-h-screen">
				<header className="border-b bg-white">
					<div className="mx-auto max-w-6xl px-4 py-3">
						<div className="flex items-center justify-between">
							<h1 className="text-lg font-semibold">Mini Banking</h1>
						</div>
					</div>
				</header>
				<main className="mx-auto max-w-6xl px-4 py-6">
					<div className="flex items-center justify-center py-12">
						<div className="text-gray-500">Loading...</div>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<header className="border-b bg-white">
				<div className="mx-auto max-w-6xl px-4 py-3">
					
					<div className="flex items-center justify-between gap-2 md:grid md:grid-cols-3">
						<h1 className="text-lg font-semibold md:justify-self-start">Mini Banking</h1>
						
						<nav className="hidden items-center justify-center gap-2 text-sm md:flex md:justify-self-center">
							<NavItem pathname={pathname} to="/" exact>Dashboard</NavItem>
							<NavItem pathname={pathname} to="/transactions">Transactions</NavItem>
						</nav>
						<div className="flex items-center gap-2 text-sm text-gray-700 md:justify-self-end">
							<span className="hidden sm:block max-w-[40vw] truncate md:max-w-[20vw]">{user?.email}</span>
							<button onClick={logout} className="rounded-md border px-3 py-1">Logout</button>
						</div>
					</div>
					
					<nav className="mt-2 flex max-w-full flex-wrap items-center gap-2 overflow-x-auto text-sm md:hidden">
						<NavItem pathname={pathname} to="/" exact>Dashboard</NavItem>
						<NavItem pathname={pathname} to="/transactions">Transactions</NavItem>
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-6xl px-4 py-6">
				<Outlet />
			</main>
		</div>
	);
}

function NavItem({ pathname, to, exact, children }: { pathname: string; to: string; exact?: boolean; children: React.ReactNode }) {
	const active = exact ? pathname === to : pathname.startsWith(to);
	return (
		<Link className={navClass(active)} to={to}>
			{children}
		</Link>
	);
}

function navClass(active: boolean) {
	return `px-3 py-1.5 rounded-md ${active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`;
}
