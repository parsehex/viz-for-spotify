import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../state';
import TrackList from '../components/TrackList';

interface SpotifyTrack {
	id: string;
	name: string;
	artists: Array<{ name: string }>;
	album: {
		name: string;
		images: Array<{ url: string }>;
	};
	uri: string;
}

interface LikedSong {
	track: SpotifyTrack;
}

const Dashboard: React.FC = () => {
	const { accessToken } = useContext(AuthContext);
	const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
	// nextUrl for pagination – Spotify’s API provides a “next” property.
	const [nextUrl, setNextUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	// A flag to let the user toggle between normal and compact view.
	const [isCompact, setIsCompact] = useState<boolean>(false);

	// Fetch liked songs from the Spotify API. (This fetches one page.)
	useEffect(() => {
		if (!accessToken) return;
		const fetchData = async () => {
			try {
				setIsLoading(true);
				// Fetch the initial page with 50 songs.
				const res = await fetch(
					'https://api.spotify.com/v1/me/tracks?limit=50',
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				const data = await res.json();
				const likedTracks: SpotifyTrack[] = data.items.map(
					(item: LikedSong) => item.track
				);
				setTracks(likedTracks);
				// Save the "next" URL for pagination.
				setNextUrl(data.next);
			} catch (error) {
				console.error('Error fetching liked songs:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [accessToken]);

	// Allow loading more songs if available.
	const loadMoreSongs = async () => {
		if (!accessToken || !nextUrl) return;
		try {
			// You can indicate loading more if desired.
			const res = await fetch(nextUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const data = await res.json();
			const moreTracks: SpotifyTrack[] = data.items.map(
				(item: LikedSong) => item.track
			);
			// Append the new tracks to the existing list.
			setTracks((prev) => [...prev, ...moreTracks]);
			setNextUrl(data.next);
		} catch (error) {
			console.error('Error loading more songs:', error);
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
				Loading your liked songs...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white p-4">
			<h1 className="text-2xl font-bold mb-4">Your Spotify Liked Songs</h1>

			{/* Controls for layout customization */}
			<div className="mb-4 flex items-center justify-center space-x-4">
				<button
					onClick={() => setIsCompact((prev) => !prev)}
					className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
				>
					{isCompact ? 'Normal View' : 'Compact View'}
				</button>
			</div>

			{/* Render the list of tracks */}
			<TrackList tracks={tracks} compact={isCompact} />

			{/* Show Load More button if there are more songs */}
			{nextUrl && (
				<div className="mt-4">
					<button
						onClick={loadMoreSongs}
						className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
					>
						Load More Songs
					</button>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
