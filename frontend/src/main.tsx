import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { AppLayout } from './ui/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { QueryProvider } from './lib/query';
import { RegisterPage } from './pages/RegisterPage';
import { ToastProvider } from './ui/ToastProvider';

const router = createBrowserRouter([
	{ path: '/login', element: <LoginPage /> },
	{ path: '/register', element: <RegisterPage /> },
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ index: true, element: <DashboardPage /> },
			{ path: 'transactions', element: <TransactionsPage /> },
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ToastProvider>
		<QueryProvider>
				<RouterProvider router={router} />
			</QueryProvider>
			</ToastProvider>
	</React.StrictMode>,
);
