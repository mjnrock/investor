import { mean, median, mode, std, variance } from "mathjs";

export class StatsHelper {

	static mean(data) {
		return mean(data);
	}

	static median(data) {
		return median(data);
	}

	static mode(data) {
		// mathjs returns an array for mode, we'll handle single or multiple modes
		const modes = mode(data);
		return modes.length === 1 ? modes[ 0 ] : modes;
	}

	static range(data) {
		return Math.max(...data) - Math.min(...data);
	}

	static standardDeviation(data) {
		return std(data);
	}

	static meanSquaredError(data) {
		const meanValue = this.mean(data);
		return data.reduce((acc, val) => acc + (val - meanValue) ** 2, 0) / data.length;
	}

	static variance(data) {
		return variance(data);
	}
};

export default StatsHelper;