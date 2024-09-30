import {Bar} from 'react-chartjs-2';

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
          display: false, // Hide the legend
        },
        tooltip: {
          enabled: false, // Disable tooltips
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