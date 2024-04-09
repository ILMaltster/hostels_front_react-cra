import { FC } from 'react';
import styles from './App.module.css';
import { RouterProvider } from 'react-router-dom';
import { rootRouter } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient()

export const App: FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={rootRouter}/>
		</QueryClientProvider>
	);
}
