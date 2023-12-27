import deepcopy from "deepcopy";
import express from "express";
import fs from "fs/promises";
import path from "path";

import { INDICATOR_OUTPUT_COLUMNS } from "../modules/node/lib/technical-analysis/TAHelper.js";
import { main as PlotlyChartPipeline } from "../data/pipelines/PlotlyChart.crypto.js";

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

		let fileName = `${ symbol }${ indicatorName ? `.${ indicatorName }` : '' }.json`;

		try {
			let options = {
				fileName,
				chartType,
				index: req?.query?.index ? parseInt(req?.query?.index) : 0,
			};

			// Check if an indicator is requested and valid
			if(indicatorName && INDICATOR_OUTPUT_COLUMNS[ indicatorName ]) {
				options.traceArrays = [ [
					"date",											// x-axis
					...INDICATOR_OUTPUT_COLUMNS[ indicatorName ],	// y-axis 1
				] ];
			}

			const schema = await PlotlyChartPipeline(options);

			res.status(200).json(schema);
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
