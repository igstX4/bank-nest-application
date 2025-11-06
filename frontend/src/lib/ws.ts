import { QueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';

let socket: WebSocket | null = null;
let toastCallback: ((title: string, message?: string) => void) | undefined;

export function connectWS(qc: QueryClient, token: string | null, onToast?: (title: string, message?: string) => void) {

	if (onToast) {
		toastCallback = onToast;
	}

	if (!token) {
		if (socket) {
			try { socket.close(); } catch {}
			socket = null;
		}
		return;
	}

	const base = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');
	const wsBase = base.startsWith('https') ? base.replace('https', 'wss') : base.replace('http', 'ws');
	const wsUrl = `${wsBase}/ws?token=${encodeURIComponent(token)}`;


	if (socket && (socket as any).__url === wsUrl && socket.readyState === WebSocket.OPEN) return;


	if (socket) {
		try { socket.close(); } catch {}
		socket = null;
	}

	socket = new WebSocket(wsUrl);
	(socket as any).__url = wsUrl;

	socket.onopen = () => {
		console.log('WebSocket connected');
	};

	socket.onmessage = (ev) => {
		try {
			const msg = JSON.parse(ev.data);
			if (msg.event === 'accounts.updated') {
				qc.invalidateQueries({ queryKey: ['accounts'] });
				qc.invalidateQueries({ queryKey: ['transactions'] });

				if (toastCallback) {
					toastCallback('Transfer received', 'Your account balance has been updated');
				}
			}
		} catch {}
	};

	socket.onclose = () => {
		const currentToken = useAuthStore.getState().token;
		if (currentToken) {
			setTimeout(() => connectWS(qc, currentToken, toastCallback), 1500);
		}
	};
}
