import React from "react";
import Plot from "react-plotly.js";

export const PlotlyChart = ({ data }) => {
	return (
		<Plot
			data={ data.data }
			layout={ data.layout }
			useResizeHandler={ true }
			style={ { width: "100%", height: "100%" } }
		/>
	);
};

export default PlotlyChart;