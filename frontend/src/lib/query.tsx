import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { connectWS } from './ws';
import { useAuthStore } from '../store/auth';
import { useToast } from '../ui/ToastProvider';

export function QueryProvider({ children }: { children: ReactNode }) {
	const [client] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	}));
	const token = useAuthStore((s) => s.token);
	const { success } = useToast();

	useEffect(() => { 
		connectWS(client, token, (title, message) => {
			success(title, message);
		}); 
	}, [client, token, success]);

	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
