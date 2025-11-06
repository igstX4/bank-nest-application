import { useState } from 'react';
import { useRegister, useMe } from '../lib/hooks';
import { useAuthStore } from '../store/auth';
import { Link, useNavigate } from 'react-router-dom';

export function RegisterPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const register = useRegister();
	const navigate = useNavigate();
	const token = useAuthStore((s) => s.token);
	useMe();

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			await register.mutateAsync({ email, password });
			navigate('/');
		} catch (err) {
			// noop; можно показать тост/ошибку
		}
	}

	if (token) {
		navigate('/');
		return null;
	}

	return (
		<div className="grid min-h-screen place-items-center bg-gray-50">
			<div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
				<h2 className="mb-1 text-center text-xl font-semibold">Create account</h2>
				<form className="space-y-4" onSubmit={onSubmit}>
					<div>
						<label className="mb-1 block text-sm text-gray-700">Email</label>
						<input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border px-3 py-2 outline-none focus:ring" placeholder="you@example.com" />
					</div>
					<div>
						<label className="mb-1 block text-sm text-gray-700">Password</label>
						<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border px-3 py-2 outline-none focus:ring" placeholder="••••••••" />
					</div>
					<button disabled={register.isPending} className="w-full rounded-md bg-gray-900 px-4 py-2 text-white">{register.isPending ? 'Creating...' : 'Register'}</button>
				</form>
				<div className="mt-4 text-center text-sm text-gray-600">
					Already have an account? <Link className="text-gray-900 underline" to="/login">Sign in</Link>
				</div>
			</div>
		</div>
	);
}
