import PieChartComponent from './PieChartComponent';
import BarChartComponent from './BarChartComponent';
import TableComponent from './TableComponent';
import ScatterChart from './ScatterChart';

const ChartContainer = ({ categoryData, title, size, selectedDistrict, type }) => {

  // Move data definition outside of the return and use it directly without 'this'
  const data = {
    "democrats": [
      { "x": 5, "y": 90 },
      { "x": 10, "y": 85 },
      { "x": 15, "y": 80 },
      { "x": 20, "y": 75 },
      { "x": 25, "y": 72 },
      { "x": 30, "y": 70 },
      { "x": 35, "y": 65 },
      { "x": 40, "y": 60 },
      { "x": 45, "y": 58 },
      { "x": 50, "y": 55 },
      { "x": 55, "y": 52 },
      { "x": 60, "y": 50 },
      { "x": 65, "y": 45 },
      { "x": 70, "y": 42 },
      { "x": 75, "y": 40 },
      { "x": 80, "y": 38 },
      { "x": 85, "y": 35 },
      { "x": 90, "y": 32 },
      { "x": 95, "y": 30 },
      { "x": 100, "y": 28 }
    ],
    "republicans": [
      { "x": 5, "y": 10 },
      { "x": 10, "y": 15 },
      { "x": 15, "y": 18 },
      { "x": 20, "y": 20 },
      { "x": 25, "y": 25 },
      { "x": 30, "y": 30 },
      { "x": 35, "y": 35 },
      { "x": 40, "y": 38 },
      { "x": 45, "y": 42 },
      { "x": 50, "y": 45 },
      { "x": 55, "y": 48 },
      { "x": 60, "y": 50 },
      { "x": 65, "y": 55 },
      { "x": 70, "y": 58 },
      { "x": 75, "y": 60 },
      { "x": 80, "y": 62 },
      { "x": 85, "y": 65 },
      { "x": 90, "y": 68 },
      { "x": 95, "y": 70 },
      { "x": 100, "y": 72 }
    ]
  };
  
  if (!categoryData || typeof categoryData !== 'object') {
    console.error('Expected categoryData to be an object but received:', categoryData);
    return null;
  }

  return (
    <div>
      <br></br>
      <h4><center>{title}</center></h4>
      {type === 'pie' && <PieChartComponent categoryData={categoryData} size={size} selectedDistrict={selectedDistrict} />}
      {type === 'bar' && <BarChartComponent categoryData={categoryData} size={size} selectedDistrict={selectedDistrict} />}
      {type === 'table' && <TableComponent categoryData={categoryData} selectedDistrict={selectedDistrict} />}
      {type === 'scatter' && <ScatterChart data={data} />}  {/* Pass data correctly here */}
    </div>
  );
};

export default ChartContainer;
