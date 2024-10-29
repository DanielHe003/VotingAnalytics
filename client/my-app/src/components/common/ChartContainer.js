import PieChartComponent from '../charts/PieChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import TableComponent from '../charts/TableComponent';
import ChartScatterComponent from '../charts/ChartScatterComponent';

const ChartContainer = ({ categoryData, title, size, selectedDistrict, type }) => {

  
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
      {type === 'scatter' && <ChartScatterComponent data={null} />}
      </div>
  );
};

export default ChartContainer;
