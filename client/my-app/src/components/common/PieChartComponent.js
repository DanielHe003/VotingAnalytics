import { Pie} from 'react-chartjs-2';
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
          backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF45B0'],
          hoverBackgroundColor: ['#007BFF', '#00BFFF', '#FFC107', '#FF7043', '#FF3D8A'],
        },
      ],
    };
  
    const options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
      },
    };
  
    return (
      <div style={{ width: size.width, height: size.height }}>
        <Pie data={data} options={options} />
      </div>
    );
  };

  export default PieChartComponent;