import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Login from './pages/Login.tsx';
import Callback from './pages/Callback.tsx';
import Dashboard from './pages/Dashboard.tsx';
import { AuthContext } from './state.ts';

// Define the shape of our authentication context.
export interface AuthContextType {
	accessToken: string | null;
	setAccessToken: (token: string | null) => void;
}

const App: React.FC = () => {
	// Try to initialize the token from localStorage so that it persists on refresh.
	const [accessToken, setAccessToken] = useState<string | null>(() => {
		return localStorage.getItem('spotify_access_token');
	});

	useEffect(() => {
		if (accessToken) {
			localStorage.setItem('spotify_access_token', accessToken);
		} else {
			localStorage.removeItem('spotify_access_token');
		}
	}, [accessToken]);

	return (
		<AuthContext.Provider value={{ accessToken, setAccessToken }}>
			<Routes>
				<Route
					path="/"
					element={accessToken ? <Navigate to="/dashboard" /> : <Login />}
				/>
				<Route path="/callback" element={<Callback />} />
				<Route
					path="/dashboard"
					element={accessToken ? <Dashboard /> : <Navigate to="/" />}
				/>
			</Routes>
		</AuthContext.Provider>
	);
};

export default App;
