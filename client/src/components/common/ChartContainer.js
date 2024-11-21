import PieChartComponent from '../charts/PieChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import TableComponent from '../charts/TableComponent';
import ChartScatterComponent from '../charts/ChartScatterComponent';
import DensityChartComponent from '../charts/DensityChartComponent';
import BoxandWhiskerComponent from '../charts/BoxandWhiskerComponent';

const ChartContainer = ({ data, title, height, width, selectedDistrict, type, xAxisTitle, yAxisTitle}) => {

  return (
    <div>
      <h4><center>{title}</center></h4>
      {type === 'pie' && <PieChartComponent categoryData={data} height={height} width={width} selectedDistrict={selectedDistrict}  />}
      {type === 'bar' && <BarChartComponent categoryData={data} height={height} width={width} selectedDistrict={selectedDistrict} />}
      {type === 'table' && <TableComponent categoryData={data} height={height} width={width} selectedDistrict={selectedDistrict} />}
      {type === 'scatter' && <ChartScatterComponent data={data} height={height} width={width} dataSets={null} populationStat={null} />}
      {type === "density" && <DensityChartComponent  title={title} data={data} height={height} width={width} xLabel={xAxisTitle} yLabel={yAxisTitle} />}
      
      {/* put the x-axis and y-axis in the array */}
      {type === "boxandwhisker" &&<BoxandWhiskerComponent data={data} xAxisTitle={xAxisTitle} yAxisTitle={yAxisTitle} height={height} width={width} />
    }
      </div>
  );
};

export default ChartContainer;
