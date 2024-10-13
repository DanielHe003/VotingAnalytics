import { Pie } from 'react-chartjs-2';

const getUniqueColor = (index) => {
  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF4500',
    '#32CD32',
    '#FFD700',
    '#7B68EE',
    '#FF1493',
    '#00BFFF',
    '#ADFF2F',
    '#FF8C00',
    '#8A2BE2',
    '#20B2AA',
    '#FF6347',
    '#FFDAB9',
    '#4682B4',
    '#DDA0DD',
    '#B22222',
  ];
  return colors[index % colors.length];
};

const PieChartComponent = ({ categoryData, selectedDistrict, size }) => {
  const pieData = Object.entries(categoryData).map(([key, value]) => ({
    name: key,
    value: parseInt(value[selectedDistrict].replace(/,/g, ''), 10),
  }));

  const data = {
    labels: pieData.map(entry => entry.name),
    datasets: [
      {
        data: pieData.map(entry => entry.value),
        backgroundColor: pieData.map((_, index) => getUniqueColor(index)),
        hoverBackgroundColor: pieData.map((_, index) => getUniqueColor(index)),
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '350px', height: "400px" }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartComponent;
