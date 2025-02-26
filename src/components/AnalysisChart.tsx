import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface AudioFeatures {
	id: string;
	danceability: number;
	energy: number;
	tempo: number;
}

interface AnalysisChartProps {
	audioFeatures: AudioFeatures[];
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({ audioFeatures }) => {
	if (!audioFeatures || audioFeatures.length === 0) {
		return null;
	}

	// Calculate averages for the chart:
	const totalDanceability = audioFeatures.reduce(
		(sum, af) => sum + (af?.danceability || 0),
		0
	);
	const totalEnergy = audioFeatures.reduce(
		(sum, af) => sum + (af?.energy || 0),
		0
	);
	const totalTempo = audioFeatures.reduce(
		(sum, af) => sum + (af?.tempo || 0),
		0
	);

	const count = audioFeatures.length;
	const avgDanceability = totalDanceability / count;
	const avgEnergy = totalEnergy / count;
	const avgTempo = totalTempo / count;

	const data = {
		labels: ['Danceability', 'Energy', 'Tempo'],
		datasets: [
			{
				label: 'Average',
				data: [avgDanceability, avgEnergy, avgTempo],
				backgroundColor: ['#34D399', '#60A5FA', '#FBBF24'],
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Average Audio Features',
			},
		},
	};

	return (
		<div className="bg-gray-800 p-4 rounded-lg">
			<Bar data={data} options={options} />
		</div>
	);
};

export default AnalysisChart;
