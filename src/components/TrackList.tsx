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
	// If true, show a more compact layout.
	compact: boolean;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, compact }) => {
	return (
		<div className="grid grid-cols-1 gap-4">
			{tracks.map((track) => {
				// Determine image styling based on the view.
				const imageSize = compact ? 'w-10 h-10' : 'w-16 h-16';
				const containerPadding = compact ? 'p-2' : 'p-4';
				const titleTextSize = compact ? 'text-base' : 'text-lg';
				return (
					<div
						key={track.id}
						className={`flex items-center bg-gray-800 ${containerPadding} rounded-lg`}
					>
						{/* Display album image if available */}
						{track.album.images && track.album.images.length > 0 && (
							<img
								src={track.album.images[0].url}
								alt={track.name}
								className={`${imageSize} rounded mr-4`}
							/>
						)}
						<div className="flex-1 text-left">
							<h2 className={`${titleTextSize} font-bold`}>{track.name}</h2>
							<p className="text-gray-400 text-sm">
								{track.artists.map((a) => a.name).join(', ')}
							</p>
							<p className="text-gray-500 text-xs">{track.album.name}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default TrackList;
