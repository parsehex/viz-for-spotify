// This file provides helper functions to implement the PKCE flow
// and to exchange the authorization code for an access token.

import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../config';

// Generate a random string to be used as the code_verifier.
export function generateRandomString(length: number): string {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

// Helper to base64URL-encode an array buffer.
function base64encode(arrayBuffer: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

// Generate the code challenge from the code verifier.
export async function generateCodeChallenge(
	codeVerifier: string
): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);
	return base64encode(digest);
}

// Exchange the authorization code along with the stored code_verifier for an access token.
export async function getAccessToken(
	code: string,
	codeVerifier: string
): Promise<unknown> {
	const params = new URLSearchParams({
		client_id: SPOTIFY_CLIENT_ID,
		grant_type: 'authorization_code',
		code,
		redirect_uri: SPOTIFY_REDIRECT_URI,
		code_verifier: codeVerifier,
	});

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: params.toString(),
	});

	if (!response.ok) {
		throw new Error('Failed to get access token');
	}

	return response.json();
}
