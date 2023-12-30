/**
 * Basic mapping of indicator names to output columns
 */
export const INDICATOR_OUTPUT_COLUMNS = {
	abs: [ "value" ],
	acos: [ "value" ],
	ad: [ "value" ],
	add: [ "value" ],
	adosc: [ "value" ],
	adx: [ "value" ],
	adxr: [ "value" ],
	ao: [ "value" ],
	apo: [ "value" ],
	aroon: [ "up", "down" ],
	aroonosc: [ "value" ],
	asin: [ "value" ],
	atan: [ "value" ],
	atr: [ "value" ],
	avgprice: [ "value" ],
	bbands: [ "lower", "middle", "upper" ],
	bop: [ "value" ],
	cci: [ "value" ],
	ceil: [ "value" ],
	cmo: [ "value" ],
	cos: [ "value" ],
	cosh: [ "value" ],
	crossany: [ "value" ],
	crossover: [ "value" ],
	cvi: [ "value" ],
	decay: [ "value" ],
	dema: [ "value" ],
	di: [ "plus", "minus" ],
	div: [ "value" ],
	dm: [ "plus", "minus" ],
	dpo: [ "value" ],
	dx: [ "value" ],
	edecay: [ "value" ],
	ema: [ "value" ],
	emv: [ "value" ],
	exp: [ "value" ],
	fisher: [ "fisher", "signal" ],
	floor: [ "value" ],
	fosc: [ "value" ],
	hma: [ "value" ],
	kama: [ "value" ],
	kvo: [ "value" ],
	lag: [ "value" ],
	linreg: [ "value" ],
	linregintercept: [ "value" ],
	linregslope: [ "value" ],
	ln: [ "value" ],
	log10: [ "value" ],
	macd: [ "macd", "signal", "histogram" ],
	marketfi: [ "value" ],
	mass: [ "value" ],
	max: [ "value" ],
	md: [ "value" ],
	medprice: [ "value" ],
	mfi: [ "value" ],
	min: [ "value" ],
	mom: [ "value" ],
	msw: [ "sine", "leadSine" ],
	mul: [ "value" ],
	natr: [ "value" ],
	nvi: [ "value" ],
	obv: [ "value" ],
	ppo: [ "value" ],
	psar: [ "value" ],
	pvi: [ "value" ],
	qstick: [ "value" ],
	roc: [ "value" ],
	rocr: [ "value" ],
	round: [ "value" ],
	rsi: [ "value" ],
	sin: [ "value" ],
	sinh: [ "value" ],
	sma: [ "value" ],
	sqrt: [ "value" ],
	stddev: [ "value" ],
	stderr: [ "value" ],
	stoch: [ "stochK", "stochD" ],
	stochrsi: [ "value" ],
	sub: [ "value" ],
	sum: [ "value" ],
	tan: [ "value" ],
	tanh: [ "value" ],
	tema: [ "value" ],
	todeg: [ "value" ],
	torad: [ "value" ],
	tr: [ "value" ],
	trima: [ "value" ],
	trix: [ "value" ],
	trunc: [ "value" ],
	tsf: [ "value" ],
	typprice: [ "value" ],
	ultosc: [ "value" ],
	var: [ "value" ],
	vhf: [ "value" ],
	vidya: [ "value" ],
	volatility: [ "value" ],
	vosc: [ "value" ],
	vwma: [ "value" ],
	wad: [ "value" ],
	wcprice: [ "value" ],
	wilders: [ "value" ],
	willr: [ "value" ],
	wma: [ "value" ],
	zlema: [ "value" ]
};

export default {
	INDICATOR_OUTPUT_COLUMNS,
};