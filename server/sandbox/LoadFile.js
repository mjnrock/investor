import fs from "fs";
import path from "path";

export const LoadFile = async (symbols, { __dirname } = {}) => {
	const directoryPath = path.join(__dirname, "./data/stocks");
	let filesData = {};

	for(const symbol of symbols) {
		try {
			const filePath = path.join(directoryPath, `${ symbol.toUpperCase() }.json`);
			if(fs.existsSync(filePath)) {
				const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
				filesData[ symbol ] = data;
			} else {
				console.log(`File not found for symbol: ${ symbol }`);
			}
		} catch(error) {
			console.error(`Error reading file for symbol ${ symbol }: ${ error }`);
		}
	}

	return filesData;
};

export default LoadFile;