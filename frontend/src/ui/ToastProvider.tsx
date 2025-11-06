import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type Toast = {
	id: number;
	type: 'success' | 'error' | 'info';
	title: string;
	message?: string;
	duration?: number; // ms
};

type ToastContextType = {
	push: (t: Omit<Toast, 'id'>) => void;
	success: (title: string, message?: string) => void;
	error: (title: string, message?: string) => void;
	info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);
const MAX_TOASTS = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<Toast[]>([]);
	const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

	const remove = useCallback((id: number) => {
		const timer = timersRef.current.get(id);
		if (timer) {
			clearTimeout(timer);
			timersRef.current.delete(id);
		}
		setItems((prev) => prev.filter((x) => x.id !== id));
	}, []);

	const push = useCallback((t: Omit<Toast, 'id'>) => {
		const id = Date.now() + Math.random();
		const duration = t.duration ?? 3000;
		setItems((prev) => {
			const next = [...prev, { id, ...t }];
			const toRemove = next.slice(0, -MAX_TOASTS);
			toRemove.forEach((item) => {
				const timer = timersRef.current.get(item.id);
				if (timer) {
					clearTimeout(timer);
					timersRef.current.delete(item.id);
				}
			});
			return next.slice(-MAX_TOASTS);
		});
		if (duration > 0) {
			const timer = setTimeout(() => remove(id), duration);
			timersRef.current.set(id, timer);
		}
	}, [remove]);

	useEffect(() => {
		return () => {
			timersRef.current.forEach((timer) => clearTimeout(timer));
			timersRef.current.clear();
		};
	}, []);

	const success = useCallback((title: string, message?: string) => push({ type: 'success', title, message }), [push]);
	const error = useCallback((title: string, message?: string) => push({ type: 'error', title, message }), [push]);
	const info = useCallback((title: string, message?: string) => push({ type: 'info', title, message }), [push]);

	return (
		<ToastContext.Provider value={{ push, success, error, info }}>
			{children}
			<div className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
				{items.map((t) => (
					<div key={t.id} className={toastClass(t.type)} role="status">
						<div className="flex items-start gap-3">
							<div className="flex-1">
								<div className="font-semibold">{t.title}</div>
								{t.message ? <div className="text-sm opacity-90">{t.message}</div> : null}
							</div>
							<button onClick={() => remove(t.id)} className="pointer-events-auto rounded-md border px-2 py-0.5 text-xs text-gray-700">
								Close
							</button>
						</div>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

function toastClass(type: Toast['type']) {
	const base = 'pointer-events-auto rounded-md border px-4 py-3 shadow bg-white';
	if (type === 'success') return base + ' border-green-300';
	if (type === 'error') return base + ' border-red-300';
	return base + ' border-gray-300';
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('ToastProvider is missing');
	return ctx;
}
