import { DataSet } from "./DataSet.js";

export class View extends DataSet {
	constructor ({ source, transformations = [] } = {}) {
		super();

		this.source = DataSet.Copy(source);
		this.transformations = transformations;

		this._refresh();
	}

	static Create(args = {}) {
		const next = new View(args);
	}
	static Copy(self) {
		return new View(self);
	}
	static Extract(self, { refresh = false } = {}) {
		if(refresh) {
			self._refresh();
		}

		return DataSet.Copy(self.data);
	}

	_refresh(...args) {
		let cache = DataSet.Copy(this.source, {
			reanalyze: false,
		});

		for(const [ type, fn ] of this.transformations) {
			cache = cache[ type ](fn, ...args);
		}

		this.data = cache.data;
		this.meta = {
			...this.meta,
			...cache.meta,
			headers: cache.meta.headers,
		};

		return this;
	}
};

export default View;