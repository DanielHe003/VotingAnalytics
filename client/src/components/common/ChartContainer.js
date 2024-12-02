import React from 'react';
import BarChartComponent from '../charts/BarChartComponent';
import TableComponent from '../charts/TableComponent';
import ChartScatterComponent from '../charts/ChartScatterComponent';
import DensityChartComponent from '../charts/DensityChartComponent';
import BoxandWhiskerComponent from '../charts/BoxandWhiskerComponent';
import './ChartContainer.css';

class ChartContainer extends React.Component {
  render() {
    const { 
      data, 
      title, 
      height, 
      width, 
      selectedDistrict, 
      type, 
      xAxisTitle, 
      yAxisTitle, 
      label 
    } = this.props;

    return (
      <div className="chartBox">
        <h4 className="title">{title}</h4>
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
  }
}

export default ChartContainer;
