import React, { useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { getAccessToken } from '../utils/spotify';
import { AuthContext } from '../state';

const Callback: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { setAccessToken } = useContext(AuthContext);

	useEffect(() => {
		const code = searchParams.get('code');
		if (!code) {
			// If no code, redirect back to login.
			navigate('/');
			return;
		}

		const codeVerifier = localStorage.getItem('spotify_code_verifier');
		if (!codeVerifier) {
			navigate('/');
			return;
		}

		// Exchange the authorization code for an access token.
		getAccessToken(code, codeVerifier)
			.then((data) => {
				setAccessToken((data as { access_token: string }).access_token);
				navigate('/dashboard');
			})
			.catch((err) => {
				console.error(err);
				navigate('/');
			});
	}, [searchParams, navigate, setAccessToken]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
			Processing login...
		</div>
	);
};

export default Callback;
