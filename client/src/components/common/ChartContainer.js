import BarChartComponent from '../charts/BarChartComponent';
import TableComponent from '../charts/TableComponent';
import ChartScatterComponent from '../charts/ChartScatterComponent';
import DensityChartComponent from '../charts/DensityChartComponent';
import BoxandWhiskerComponent from '../charts/BoxandWhiskerComponent';

const ChartContainer = ({ data, title, height, width, selectedDistrict, type, xAxisTitle, yAxisTitle, label }) => {
  return (
    <div style={styles.chartBox}>
      <h4 style={styles.title}>{title}</h4>
      {type === 'bar' && (
        <BarChartComponent 
          categoryData={data} 
          height={height} 
          width={width} 
          label={label}
          xAxisTitle={xAxisTitle}
          yAxisTitle={yAxisTitle}
        />
      )}

      {type === 'table' && (
        <TableComponent 
          categoryData={data} 
          height={height} 
          width={width} 
          selectedDistrict={selectedDistrict} 
        />
      )}

      {type === 'scatter' && (
        <ChartScatterComponent 
          data={data} 
          height={height} 
          width={width} 
          dataSets={null} 
          populationStat={null} 
        />
      )}

      {type === 'density' && (
        <DensityChartComponent 
          title={title} 
          data={data} 
          height={height} 
          width={width} 
          xLabel={xAxisTitle} 
          yLabel={yAxisTitle} 
        />
      )}

      {type === 'boxandwhisker' && (
        <BoxandWhiskerComponent 
          data={data} 
          xAxisTitle={xAxisTitle} 
          yAxisTitle={yAxisTitle} 
          height={height} 
          width={width} 
        />
      )}
    </div>
  );
};

const styles = {
  chartBox: {
    border: '2px solid #005ba6',
    borderRadius: '10px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    maxWidth: '750px',
    marginBottom: '30px',
  },
  title: {
    backgroundColor: '#005ba6',
    color: 'white',
    padding: '6px 10px',
    borderRadius: '5px',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '30px',
  },
};

export default ChartContainer;
