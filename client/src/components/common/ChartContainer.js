import React from "react";
import BarChartComponent from "../charts/BarChartComponent";
import TableComponent from "../charts/TableComponent";
import ChartScatterComponent from "../charts/ChartScatterComponent";
import DensityChartComponent from "../charts/DensityChartComponent";
import BoxandWhiskerComponent from "../charts/BoxandWhiskerComponent";
import "./ChartContainer.css";

class ChartContainer extends React.Component {
  render() {
    const {
      data,
      title,
      height,
      width,
      type,
      xAxisTitle,
      yAxisTitle,
      label,
      titleRender,
    } = this.props;

    console.log(data);

    return (
      <>
        {/* State Summary */}
        {titleRender && (
          <>
            <div className="chartBox">
              <h4 className="title">{title}</h4>
          {type === "table" && (
          <TableComponent data={data} height={height} width={width} />
        )}
              {type === "bar" && (
                <BarChartComponent
                  categoryData={data}
                  height={height}
                  width={width}
                  label={label}
                  xAxisTitle={xAxisTitle}
                  yAxisTitle={yAxisTitle}
                />
              )}
            </div>
          </>
        )}
        
       
       

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px",
          }}
        >
          {type === "density" && (
            <div
              style={{
                border: "2px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                boxShadow: "0 0 0 2px blue",
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "blue",
                }}
              >
                Support for Biden (Democrat)
              </h3>
              <DensityChartComponent
                data={{
                  groups: [data.bidenData[0], data.bidenData[1]],
                }}
                height={height}
                width={width}
              />
            </div>
          )}

          {type === "density" && (
            <div
              style={{
                // border: "2px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                marginTop: "20px",
                boxShadow: "0 0 0 2px red",
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                Support for Trump (Republican)
              </h3>
              <DensityChartComponent
                data={{
                  groups: [data.trumpData[0], data.trumpData[1]],
                }}
                height={height}
                width={width}
              />
            </div>
          )}
        </div>

        {type === "boxandwhisker" && (
          <BoxandWhiskerComponent
            data={data}
            xAxisTitle={xAxisTitle}
            yAxisTitle={yAxisTitle}
            height={height}
            width={width}
          />
        )}

        {type === "scatter" && (
          <ChartScatterComponent
            data={data}
            height={height}
            width={width}
          />
        )}
      </>
    );
  }
}

export default ChartContainer;
