import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

import { DataSet } from "../modules/node/lib/data-set/DataSet.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EnumType = {
	DIRECTORY: "dir",
	FILE: "file"
};

const readDirectoryContents = async (dir, parentId = null) => {
	let results = [];

	const files = await fs.readdir(dir, { withFileTypes: true });
	for(const file of files) {
		const id = uuidv4();
		const filePath = path.join(dir, file.name);

		if(file.isDirectory()) {
			results.push({ id, type: EnumType.DIRECTORY, pid: parentId, name: file.name });
			const children = await readDirectoryContents(filePath, id);
			results = results.concat(children);
		} else {
			results.push({ id, type: EnumType.FILE, pid: parentId, name: file.name });
		}
	}

	const dataSet = DataSet.Create({
		meta: {
			directory: dir,
			parentId,
		},
		data: results,
	});
	fs.writeFile("fs.ds", DataSet.ToJson(dataSet));

	return results;
};

readDirectoryContents(__dirname).then(contents => {
	console.log(contents);
}).catch(error => {
	console.error(`Error: ${ error }`);
});
