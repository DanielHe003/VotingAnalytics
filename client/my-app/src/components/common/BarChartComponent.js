import { Bar } from 'react-chartjs-2';

const BarChartComponent = ({ categoryData, selectedDistrict, size }) => {
  const barData = Object.entries(categoryData).map(([key, value]) => ({
    name: key,
    value: parseInt(value[selectedDistrict].replace(/,/g, ''), 10)
  }));

  const data = {
    labels: barData.map(entry => entry.name),
    datasets: [
      {
        label: 'Count',
        data: barData.map(entry => entry.value),
        backgroundColor: '#42A5F5',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hides the legend
      },
      tooltip: {
        enabled: true, // Enables tooltips
        callbacks: {
          label: (context) => `Count: ${context.raw.toLocaleString()}`, // Show count on hover with commas
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            weight: 'bold', // Bold labels
          },
          maxRotation: 45, // Tilted labels for better readability
          minRotation: 30,
        },
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} width={size.width} height={size.height} />
    </div>
  );
};

export default BarChartComponent;
