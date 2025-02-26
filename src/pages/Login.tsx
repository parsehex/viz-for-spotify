import React from 'react';
import {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_REDIRECT_URI,
	SPOTIFY_SCOPES,
} from '../config';
import { generateRandomString, generateCodeChallenge } from '../utils/spotify';

const Login: React.FC = () => {
	const handleLogin = async () => {
		// Generate a code verifier and calculate its challenge.
		const codeVerifier = generateRandomString(128);
		const codeChallenge = await generateCodeChallenge(codeVerifier);

		// Save the code verifier to localStorage so we can use it in the callback.
		localStorage.setItem('spotify_code_verifier', codeVerifier);

		// Build the Spotify authorization URL.
		const params = new URLSearchParams({
			response_type: 'code',
			client_id: SPOTIFY_CLIENT_ID,
			scope: SPOTIFY_SCOPES,
			redirect_uri: SPOTIFY_REDIRECT_URI,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge,
		});

		window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-900">
			<button
				onClick={handleLogin}
				className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
			>
				Login with Spotify
			</button>
		</div>
	);
};

export default Login;
