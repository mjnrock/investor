import deepcopy from "deepcopy";
import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export class UrlScraperNode {
	static WeightedPool = (pool, run = true) => {
		const totalWeight = pool.reduce((sum, [ weight ]) => sum + parseFloat(weight), 0);
		const fn = () => {
			let randomNum = Math.floor(Math.random() * totalWeight);
			let weightSum = 0;

			for(let [ weight, item ] of pool) {
				weightSum += weight;

				if(randomNum < weightSum) {
					return item;
				}
			}
		};

		return run ? fn() : fn;
	};

	static Headers = [
		[ 70, {
			"Referer": "https://www.google.com/search?q=trending+market+news",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "en-US,en;q=0.5",
			"Cache-Control": "max-age=0",
			"Connection": "keep-alive",
			"DNT": "1",
			"Sec-Fetch-Site": "none",
			"Sec-Fetch-Mode": "navigate",
			"Sec-Fetch-User": "?1",
			"Sec-Fetch-Dest": "document",
			"Upgrade-Insecure-Requests": "1",
		} ],
		[ 20, {
			"Referer": "https://www.bing.com/search?q=trending+market+news",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "en-US,en;q=0.5",
			"Cache-Control": "max-age=0",
			"Connection": "keep-alive",
			"DNT": "1",
			"Sec-Fetch-Site": "none",
			"Sec-Fetch-Mode": "navigate",
			"Sec-Fetch-User": "?1",
			"Sec-Fetch-Dest": "document",
			"Upgrade-Insecure-Requests": "1",
		} ],
		[ 10, {
			"Referer": "https://duckduckgo.com/?q=trending+market+news",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "en-US,en;q=0.5",
			"Cache-Control": "max-age=0",
			"Connection": "keep-alive",
			"DNT": "1",
			"Sec-Fetch-Site": "none",
			"Sec-Fetch-Mode": "navigate",
			"Sec-Fetch-User": "?1",
			"Sec-Fetch-Dest": "document",
			"Upgrade-Insecure-Requests": "1",
		} ],
	];
	static UserAgents = {
		Desktop: [
			[ 60, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Safari/537.36" ],
			[ 30, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0" ],
			[ 40, "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15" ],
			[ 30, "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Safari/537.36" ],
			[ 20, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Edge/99.0" ],
			[ 10, "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:98.0) Gecko/20100101 Firefox/98.0" ],
			[ 6, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15" ],
			[ 2, "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Safari/537.36" ],
			[ 1, "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko" ],
			[ 1, "Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Safari/537.36" ]
		],
		Mobile: [
			[ 25, "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1" ],
			[ 20, "Mozilla/5.0 (Linux; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/16.0 Chrome/100.0.1234.567 Mobile Safari/537.36" ],
			[ 15, "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1" ],
			[ 10, "Mozilla/5.0 (Linux; Android 10; Mobile; rv:98.0) Gecko/98.0 Firefox/98.0" ],
			[ 10, "Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Mobile Safari/537.36" ],
			[ 5, "Mozilla/5.0 (Linux; U; Android 9; en-US; Redmi Note 5 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 Mobile Safari/537.36" ],
			[ 5, "Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/100.0.1234.567 Mobile/15E148 Safari/604.1" ],
			[ 5, "Mozilla/5.0 (Linux; Android 10; SM-A105F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/100.0.1234.567 Mobile Safari/537.36" ],
			[ 3, "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/98.0 Mobile/15E148 Safari/605.1.15" ],
			[ 2, "Mozilla/5.0 (Linux; Android 11; K40 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Mobile Safari/537.36" ]
		],
	};

	constructor ({ url, file, allowDesktop = true, allowMobile = false } = {}) {
		this.state = {
			url,
			file,
			allowDesktop,
			allowMobile,
		};

		this.headers = deepcopy(UrlScraperNode.Headers);
		this.desktopUserAgents = deepcopy(UrlScraperNode.UserAgents.Desktop);
		this.mobileUserAgents = deepcopy(UrlScraperNode.UserAgents.Mobile);
	}

	static Create(...args) {
		return new this(...args);
	}

	getRandomUserAgent(allowDesktop = true, allowMobile = true) {
		if(allowDesktop && allowMobile) {
			return UrlScraperNode.WeightedPool(
				(Math.random() < 0.5)
					? this.desktopUserAgents
					: this.mobileUserAgents
				, true);
		} else if(allowDesktop) {
			return UrlScraperNode.WeightedPool(this.desktopUserAgents, true);
		} else if(allowMobile) {
			return UrlScraperNode.WeightedPool(this.mobileUserAgents, true);
		} else {
			throw new Error("At least one of allowDesktop or allowMobile must be true.");
		}
	}
	getRandomHeader() {
		return UrlScraperNode.WeightedPool(this.headers, true);
	}

	/**
	 * Returns the readable content of the article at the given URL.
	 */
	async extractAndSaveArticle({ url, file, allowDesktop, allowMobile } = {}, context = {}) {
		try {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();

			await page.setUserAgent(this.getRandomUserAgent(allowDesktop, allowMobile));
			await page.setExtraHTTPHeaders(this.getRandomHeader());

			await this.navigate(page, url);

			const content = await page.content();

			await browser.close();

			const doc = new JSDOM(content, {
				contentType: "text/html",
			});

			const reader = new Readability(doc.window.document);
			const article = reader.parse();

			// Process file path with context variables
			const { variables } = context;
			if(variables) {
				for(const variable in variables) {
					file = file.replace(`{{${ variable }}}`, variables[ variable ]);
				}
			}

			// Join the processed file path with the current working directory
			file = path.join(process.cwd(), file);

			// Saving the extracted article content to a file
			await fs.writeFile(file, JSON.stringify(article), 'utf8');

		} catch(error) {
			console.error("Error extracting and saving article:", error);
			throw error;
		}
	}

	async navigate(page, url) {
		await page.goto(url, { waitUntil: "domcontentloaded" });
	}

	async run(input = {}, context = {}) {
		const { url, file, allowDesktop, allowMobile } = {
			...this.state,
			...input,
		};

		if(!url || !file) {
			throw new Error("URL and output file name must be provided.");
		}

		return await this.extractAndSaveArticle({ url, file, allowDesktop, allowMobile }, context);
	}
}

export default UrlScraperNode;