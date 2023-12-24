import deepcopy from "deepcopy";
import express from "express";
import fs from "fs/promises";
import path from "path";

import { DataSet } from "../modules/node/data-set/DataSet.js";
import { Plotly } from "../modules/node/plotly/Plotly.js";

const dataSetToMetaObject = (dataSet) => {
	const obj = {
		symbol: dataSet.meta.symbol,
		meta: deepcopy(dataSet.meta),
	};

	if(dataSet.meta.technicalAnalysis) {
		obj.ta = [
			dataSet.meta.technicalAnalysis.fn,
			dataSet.meta.technicalAnalysis.cols,
			dataSet.meta.technicalAnalysis.args,
		];
	}

	return obj;
};

export const router = async (__dirname) => {
	const cryptoRouter = express.Router();

	cryptoRouter.get("/chart/:symbol", async (req, res) => {
		const { symbol } = req.params;
		const indicatorName = req?.query?.ti?.toLowerCase();
		const chartType = req?.query?.chartType?.toLowerCase() || "bar";

		let fileName = `${ symbol }.json`;
		let filePath = path.join(__dirname, "./data/cryptos", fileName);

		if(indicatorName) {
			fileName = `${ symbol }.${ indicatorName }.json`;
			filePath = path.join(__dirname, "./data/cryptos", fileName);
		}

		try {
			const file = await fs.readFile(filePath, "utf8");
			let fileObj = JSON.parse(file);

			let dataSet = new DataSet(fileObj);
			let plotly = Plotly.Create({ source: dataSet });

			switch(chartType) {
				case "bar":
					plotly = Plotly.ToBarChart(plotly, [ [ "date", "close" ] ]);
					break;
				case "line":
					plotly = Plotly.ToLineChart(plotly, [ [ "date", "close" ] ]);
					break;
				case "candlestick":
					plotly = Plotly.ToCandlestickChart(plotly, [ [ "date", "open" ], [ "date", "high" ], [ "date", "low" ], [ "date", "close" ] ]);
					break;
				default:
					throw new Error("Unsupported chart type");
			}

			res.status(200).json(plotly.toSchema());
		} catch(error) {
			res.status(404).send(`Chart file not found for symbol: ${ symbol }`);
		}
	});

	cryptoRouter.get("/:symbol", async (req, res) => {
		const { symbol } = req.params;
		const indicatorName = req?.query?.ti?.toLowerCase();
		const metaOnly = req?.query?.metaOnly?.toLowerCase() === "true";

		let fileName = `${ symbol }.json`;
		let filePath = path.join(__dirname, "./data/cryptos", fileName);

		if(indicatorName) {
			fileName = `${ symbol }.${ indicatorName }.json`;
			filePath = path.join(__dirname, "./data/cryptos", fileName);
		}

		try {
			const file = await fs.readFile(filePath, "utf8");

			let fileObj = JSON.parse(file);

			if(metaOnly) {
				if(Array.isArray(fileObj)) {
					let metaFileData = fileObj.map(dataSetToMetaObject);

					res.status(200).json(metaFileData);
				} else {
					res.status(200).json(dataSetToMetaObject(fileObj));
				}
			} else {
				res.status(200).json(fileObj);
			}
		} catch(error) {
			res.status(404).send(`File not found for symbol: ${ symbol }`);
		}
	});

	return cryptoRouter;
};

export default router;
