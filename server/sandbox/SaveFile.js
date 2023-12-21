import fs from "fs/promises";
import path from "path";

export const SaveFile = async (symbolMap, fileNamePattern, directoryPath = "stocks") => {
	try {
		const basePath = path.join("./data", directoryPath);

		await fs.mkdir(basePath, { recursive: true });

		for(const [ symbol, data ] of Object.entries(symbolMap)) {
			const fileName = fileNamePattern.replace("{{SYMBOL}}", symbol);
			const filePath = path.join(basePath, fileName);

			await fs.writeFile(filePath, JSON.stringify(data, null, 4));

			console.log(`File saved for ${ symbol }: ${ filePath }`);
		}
	} catch(error) {
		console.error("Error in saving files:", error);
	}
};

export default SaveFile;