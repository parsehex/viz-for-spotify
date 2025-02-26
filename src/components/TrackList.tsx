import React from 'react';

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

interface TrackListProps {
	tracks: SpotifyTrack[];
}

const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
	return (
		<div className="grid grid-cols-1 gap-4">
			{tracks.map((track) => (
				<div
					key={track.id}
					className="flex items-center bg-gray-800 p-4 rounded-lg"
				>
					{track.album.images && track.album.images.length > 0 && (
						<img
							src={track.album.images[0].url}
							alt={track.name}
							className="w-16 h-16 rounded mr-4"
						/>
					)}
					<div>
						<h2 className="text-lg font-bold">{track.name}</h2>
						<p className="text-gray-400">
							{track.artists.map((a) => a.name).join(', ')}
						</p>
						<p className="text-gray-500 text-sm">{track.album.name}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default TrackList;
