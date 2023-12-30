import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

import { DataSet } from "../../../modules/node/lib/data-set/DataSet.js";

export class MapDirectory {
	static EnumType = {
		DIRECTORY: "dir",
		FILE: "file"
	};

	constructor ({ dir, pid = null }) {
		this.dir = dir;
		this.pid = pid;
	}

	async run({ dir = this.dir, pid = this.pid } = {}, { hashAlgo = "sha256", isChildCall = false } = {}) {
		let results = [];

		const files = await fs.readdir(dir, { withFileTypes: true });
		for(const file of files) {
			const id = uuidv4();
			const filePath = path.join(dir, file.name);

			if(file.isDirectory()) {
				results.push({ id, type: MapDirectory.EnumType.DIRECTORY, pid, name: file.name });
				const children = await this.run({ dir: filePath, pid: id }, { isChildCall: true });
				results = results.concat(children);
			} else {
				results.push({ id, type: MapDirectory.EnumType.FILE, pid, name: file.name });
			}
		}

		if(!isChildCall) {
			const hash = createHash(hashAlgo);
			hash.update(dir);
			const dirHash = hash.digest("hex");

			const dataSet = DataSet.Create({
				meta: {
					directory: dir,
					parentId: pid,
					hash: dirHash,
					created: Date.now(),
				},
				data: results
			});

			await fs.writeFile(`fs-${ dirHash }.ds`, DataSet.ToJson(dataSet));
		}

		return results;
	}
}

export default MapDirectory;


// example usage:

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const mapDirectory = new MapDirectory({
// 	dir: path.join(__dirname, "../../../data/stocks"),
// 	// dir: __dirname,
// });
// mapDirectory.run().then(contents => {
// 	console.log(contents);
// }).catch(error => {
// 	console.error(`Error: ${ error }`);
// });