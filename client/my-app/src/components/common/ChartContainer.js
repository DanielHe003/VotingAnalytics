import PieChartComponent from '../charts/PieChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import TableComponent from '../charts/TableComponent';
import ChartScatterComponent from '../charts/ChartScatterComponent';
import DensityChartComponent from '../charts/DensityChartComponent';
import BoxPlotComponent from '../charts/BoxPlotComponent';

const ChartContainer = ({ data, title, height, width, selectedDistrict, type }) => {

  return (
    <div>
      <h4><center>{title}</center></h4>
      {type === 'pie' && <PieChartComponent categoryData={null} height={null} width={null} selectedDistrict={null}  />}
      {type === 'bar' && <BarChartComponent categoryData={null} height={null} width={null} selectedDistrict={null} />}
      {type === 'table' && <TableComponent categoryData={null} height={null} width={null} selectedDistrict={null} />}
      {type === 'scatter' && <ChartScatterComponent data={null} height={null} width={null} dataSets={null} populationStat={null} />}
      {type === "density" && <DensityChartComponent  title={null} data={null} height={null} width={null} xLabel={null} yLabel={null} />}
      {type === "boxplot" && <BoxPlotComponent data={null} height={null} width={null} />}
      </div>
  );
};

export default ChartContainer;
