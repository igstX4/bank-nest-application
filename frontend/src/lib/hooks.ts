import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { useAuthStore } from '../store/auth';
import { useToast } from '../ui/ToastProvider';

function getErrorMessage(err: any): string {
	const msg = err?.response?.data?.message || err?.message || 'Unexpected error';
	return Array.isArray(msg) ? msg.join(', ') : String(msg);
}

export function useRegister() {
	const setToken = useAuthStore((s) => s.setToken);
	const { push } = useToast();
	return useMutation({
		mutationFn: async (payload: { email: string; password: string }) => {
			const { data } = await api.post<{ token: string }>('/auth/register', payload);
			return data;
		},
		onSuccess: (data) => { setToken(data.token); push({ type: 'success', title: 'Account created' }); },
		onError: (err) => push({ type: 'error', title: 'Registration failed', message: getErrorMessage(err) }),
	});
}

export function useAuthLogin() {
	const setToken = useAuthStore((s) => s.setToken);
	const { push } = useToast();
	return useMutation({
		mutationFn: async (payload: { email: string; password: string }) => {
			const { data } = await api.post<{ token: string }>('/auth/login', payload);
			return data;
		},
		onSuccess: (data) => { setToken(data.token); push({ type: 'success', title: 'Logged in' }); },
		onError: (err) => push({ type: 'error', title: 'Login failed', message: getErrorMessage(err) }),
	});
}

export function useMe() {
	const setUser = useAuthStore((s) => s.setUser);
	const token = useAuthStore.getState().token;
	return useQuery({
		queryKey: ['me'],
		queryFn: async () => {
			const { data } = await api.get<{ userId: number; email: string }>('/auth/me');
			setUser({ id: data.userId, email: data.email });
			return data;
		},
		enabled: !!token,
		retry: false,
	});
}

export function useAccounts() {
	return useQuery({
		queryKey: ['accounts'],
		queryFn: async () => (await api.get('/accounts')).data,
		enabled: !!useAuthStore.getState().token,
	});
}

export function useTransactions(params?: { type?: 'transfer' | 'exchange'; page?: number; limit?: number }) {
	const q = { page: params?.page ?? 1, limit: params?.limit ?? 20, type: params?.type ?? '' };
	return useQuery({
		queryKey: ['transactions', q],
		queryFn: async () => (await api.get('/transactions', { params: q })).data,
		enabled: !!useAuthStore.getState().token,
	});
}

export function useTransfer() {
	const qc = useQueryClient();
	const { push } = useToast();
	return useMutation({
		mutationFn: async (payload: { recipientEmail: string; currency: 'USD' | 'EUR'; amount: number }) => {
			return (await api.post('/transactions/transfer', payload)).data;
		},
		onSuccess: () => {
			push({ type: 'success', title: 'Transfer completed' });
			qc.invalidateQueries({ queryKey: ['accounts'] });
			qc.invalidateQueries({ queryKey: ['transactions'] });
		},
		onError: (err) => push({ type: 'error', title: 'Transfer failed', message: getErrorMessage(err) }),
	});
}

export function useExchange() {
	const qc = useQueryClient();
	const { push } = useToast();
	return useMutation({
		mutationFn: async (payload: { fromCurrency: 'USD' | 'EUR'; amount: number }) => {
			return (await api.post('/transactions/exchange', payload)).data;
		},
		onSuccess: () => {
			push({ type: 'success', title: 'Exchange completed' });
			qc.invalidateQueries({ queryKey: ['accounts'] });
			qc.invalidateQueries({ queryKey: ['transactions'] });
		},
		onError: (err) => push({ type: 'error', title: 'Exchange failed', message: getErrorMessage(err) }),
	});
}
