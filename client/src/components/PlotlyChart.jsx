import React from "react";
import Plot from "react-plotly.js";

export const PlotlyChart = ({ schema }) => {
	return (
		<Plot
			data={ schema.data }
			layout={ schema.layout }
			useResizeHandler={ true }
			style={ { width: "100%", height: "100%" } }
		/>
	);
};

export default PlotlyChart;