import { create } from 'zustand';

export type AuthUser = { id: number; email: string } | null;

// keys

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

type AuthState = {
	user: AuthUser;
	token: string | null;
	setUser: (user: AuthUser) => void;
	setToken: (token: string | null) => void;
	logout: () => void;
};

function read<T>(key: string): T | null {
	try {
		const v = localStorage.getItem(key);
		return v ? (JSON.parse(v) as T) : null;
	} catch {
		return null;
	}
}

export const useAuthStore = create<AuthState>((set) => ({
	user: read<AuthUser>(USER_KEY),
	token: read<string>(TOKEN_KEY),
	setUser: (user) => {
		try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch {}
		set({ user });
	},
	setToken: (token) => {
		try { localStorage.setItem(TOKEN_KEY, JSON.stringify(token)); } catch {}
		set({ token });
	},
	logout: () => {
		try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); } catch {}
		set({ user: null, token: null });
	},
}));
