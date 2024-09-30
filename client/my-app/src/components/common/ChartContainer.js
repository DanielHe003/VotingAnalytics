import PieChartComponent from './PieChartComponent';
import BarChartComponent from './BarChartComponent';
import TableComponent from './TableComponent';

const ChartContainer = ({ categoryData, title, size, selectedDistrict, type }) => {
    if (!categoryData || typeof categoryData !== 'object') {
      console.error('Expected categoryData to be an object but received:', categoryData);
      return null;
    }
  
    return (
      <div>
        {/* <h4><center>{title}</center></h4> */}
        {type === 'pie' && <PieChartComponent categoryData={categoryData} size={size} selectedDistrict={selectedDistrict} />}
        {type === 'bar' && <BarChartComponent categoryData={categoryData} size={size} selectedDistrict={selectedDistrict} />}
        {type === 'table' && <TableComponent categoryData={categoryData} selectedDistrict={selectedDistrict} />}
      </div>
    );
  };

  export default ChartContainer;