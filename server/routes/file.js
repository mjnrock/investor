import deepcopy from "deepcopy";
import express from "express";
import fs from "fs/promises";
import path from "path";

import { main as PlotlyChartPipeline } from "../plugins/plotly/pipelines/PlotlyChart.js";

const dataSetToMetaObject = (dataSet) => {
	const obj = {
		fileName: dataSet.meta.fileName,
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
	const fileRouter = express.Router();

	fileRouter.get("/chart/:fileType/:fileName", async (req, res) => {
		const { fileType, fileName } = req.params;

		let fileDirectory = fileType;

		// Only proceed if file ends with ".ds"
		if(!fileName.endsWith(".ds")) {
			return res.status(400).send("Invalid file type for chart.");
		}

		try {
			let options = {
				fileType: fileDirectory,
				fileName,
				chartType: req?.query?.chartType?.toLowerCase() || "bar",
				index: req?.query?.index ? parseInt(req?.query?.index) : 0,
				traceArrays: [ [ "date", "value" ] ] // Default trace array
			};

			const schema = await PlotlyChartPipeline(options);
			res.status(200).json(schema);
		} catch(error) {
			res.status(404).send(`Chart file not found for file: ${ fileName }`);
		}
	});

	fileRouter.get("/:fileType/:fileName", async (req, res) => {
		const { fileType, fileName } = req.params;
		const metaOnly = req?.query?.metaOnly?.toLowerCase() === "true";

		let fileDirectory = fileType;
		let filePath = path.join(__dirname, `./data/${ fileDirectory }`, fileName);

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
			res.status(404).send(`File not found: ${ fileName }`);
		}
	});

	return fileRouter;
};

export default router;