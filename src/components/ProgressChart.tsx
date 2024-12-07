import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { AggregatedProgress } from '../types/AggregatedProgress';
import '../styles/index.css';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

interface ProgressChartProps {
  progressData: AggregatedProgress | null;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ progressData }) => {
  if (!progressData) {
    return <div>No progress data available.</div>;
  }

  const data = {
    labels: progressData.dates.map((date) => date.toLocaleDateString()),
    datasets: [
      {
        label: 'Weight Loss (kg)',
        data: progressData.weightLoss,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Steps Taken',
        data: progressData.stepsTaken,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="progress-chart">
      <Line data={data} />
    </div>
  );
};

export default ProgressChart;