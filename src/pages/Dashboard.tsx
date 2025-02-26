import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../state';
// import AnalysisChart from '../components/AnalysisChart';
import TrackList from '../components/TrackList';

// Some simple TypeScript interfaces to type the fetched data.
interface SpotifyTrack {
	id: string;
	name: string;
	artists: Array<{ name: string }>;
	album: { name: string; images: Array<{ url: string }> };
	uri: string;
}

// interface AudioFeatures {
// 	id: string;
// 	danceability: number;
// 	energy: number;
// 	tempo: number;
// 	// You can add more features if needed.
// }

interface LikedSong {
	track: SpotifyTrack;
}

const Dashboard: React.FC = () => {
	const { accessToken } = useContext(AuthContext);
	const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
	// const [audioFeatures, setAudioFeatures] = useState<AudioFeatures[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!accessToken) return;

		const fetchData = async () => {
			try {
				// Fetch the user's liked songs (saved tracks).
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

				// Fetch audio features for these tracks.
				// const trackIds = likedTracks.map((t) => t.id).join(',');
				// const afRes = await fetch(
				// 	`https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
				// 	{
				// 		headers: {
				// 			Authorization: `Bearer ${accessToken}`,
				// 		},
				// 	}
				// );
				// const afData = await afRes.json();
				// setAudioFeatures(afData.audio_features);
			} catch (error) {
				console.error('Error fetching liked songs:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [accessToken]);

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

			{/* <div className="mb-8">
				<AnalysisChart audioFeatures={audioFeatures} />
			</div> */}

			<TrackList tracks={tracks} />
		</div>
	);
};

export default Dashboard;
