import React from "react";
import Plot from "react-plotly.js";

export const PlotlyChart = ({ schema }) => {
	return (
		<Plot
			data={ schema.data }
			layout={ schema.layout }
			useResizeHandler={ true }
		/>
	);
};

export default PlotlyChart;