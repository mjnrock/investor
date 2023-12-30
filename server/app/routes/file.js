import express from "express";
import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";

import { main as PlotlyChartPipeline } from "../plugins/plotly/pipelines/PlotlyChart.js";
import DataSet from "../../modules/node/lib/data-set/DataSet.js";

export const modifyFileType = (fileType) => {
	return fileType;
};

export const processDataSetFile = (fileObj, query) => {
	const metaOnly = query?.metaOnly?.toLowerCase() === "true";
	const dataOnly = query?.dataOnly?.toLowerCase() === "true";

	if(metaOnly) {
		return Array.isArray(fileObj) ? fileObj.map(dataSet => dataSet.meta) : fileObj.meta;
	} else if(dataOnly) {
		const { asRecords, asRows, asColumns } = query;

		const processData = dataSet => {
			const ds = DataSet.Create(dataSet);

			if(asRecords) {
				return ds.getRecords();
			} else if(asRows) {
				return ds.getRows();
			} else if(asColumns) {
				return ds.getColumns();
			}

			return ds.getRecords();
		};

		return Array.isArray(fileObj) ? fileObj.map(processData) : processData(fileObj);
	}

	return fileObj;
};

export const router = (__dirname) => {
	const fileRouter = express.Router();

	fileRouter.get("/ls/:fileType", async (req, res) => {
		const { fileType } = req.params;
		const modifiedFileType = modifyFileType(fileType);
		const fileDirectory = path.join(__dirname, `./app/data/${ modifiedFileType }`);
		const hash = createHash("sha256");
		hash.update(fileDirectory);
		const fileTypeHash = hash.digest("hex");

		const fileName = `fs-${ fileTypeHash }.ds`;
		const filePath = path.join(fileDirectory, fileName);

		try {
			const fileContents = await fs.readFile(filePath, "utf8");
			const fileObj = JSON.parse(fileContents);
			const processedData = processDataSetFile(fileObj, req.query);
			res.status(200).json(processedData);
		} catch(error) {
			res.status(404).send(`File not found: ${ fileName }`);
		}
	});

	fileRouter.get("/chart/:fileType/:fileName", async (req, res) => {
		const { fileType, fileName } = req.params;
		const modifiedFileType = modifyFileType(fileType);

		if(!fileName.endsWith(".ds")) {
			return res.status(400).send("Invalid file type for chart.");
		}

		try {
			let options = {
				fileType: modifiedFileType,
				fileName,
				chartType: req.query.chartType?.toLowerCase() || "bar",
				index: req.query.index ? parseInt(req.query.index) : 0,
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
		const modifiedFileType = modifyFileType(fileType);
		let filePath = path.join(__dirname, `./app/data/${ modifiedFileType }`, fileName);

		try {
			const file = await fs.readFile(filePath, "utf8");
			let fileObj = JSON.parse(file);
			const processedData = processDataSetFile(fileObj, req.query);
			res.status(200).json(processedData);
		} catch(error) {
			res.status(404).send(`File not found: ${ fileName }`);
		}
	});

	return fileRouter;
};

export default router;