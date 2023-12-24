import puppeteer from "puppeteer";
import fs from "fs/promises";
import { read } from "node-readability";

export const desktopUserAgents = [
	// Windows 10 with Microsoft Edge
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Safari/537.36 Edg/100.0.123.456',

	// macOS Monterey with Safari
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',

	// Windows 7 with Firefox
	'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0',

	// Linux (Ubuntu) with Chrome
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Safari/537.36',

	// macOS Big Sur with Firefox
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 11.0; rv:98.0) Gecko/20100101 Firefox/98.0',

	// Windows 8.1 with Internet Explorer
	'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',

	// Android 10 with Firefox
	'Mozilla/5.0 (Android 10; Mobile; rv:98.0) Gecko/98.0 Firefox/98.0',

	// iOS 14 with Microsoft Edge
	'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/101.0 Mobile/15E148 Safari/605.1.15 EdgA/101.0.123.456',

	// Linux (Fedora) with Mozilla
	'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',

	// macOS High Sierra with Brave
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Safari/537.36 Brave/1.41.123',
];
export const mobileUserAgents = [
	// Android 12 with Chrome
	'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Mobile Safari/537.36',

	// iOS 15 with Safari
	'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',

	// Android 11 with Samsung Internet Browser
	'Mozilla/5.0 (Linux; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/16.0 Chrome/100.0.1234.567 Mobile Safari/537.36',

	// iOS 15 with Safari
	'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',

	// Android 9 with UC Browser
	'Mozilla/5.0 (Linux; Android 9; SM-G950U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Mobile Safari/537.36',

	// Android 10 with Firefox
	'Mozilla/5.0 (Android 10; Mobile; rv:98.0) Gecko/98.0 Firefox/98.0',

	// Windows Vista with Opera Mini
	'Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.17',

	// iOS 14 with Microsoft Edge
	'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/101.0 Mobile/15E148 Safari/605.1.15 EdgA/101.0.123.456',

	// Android 12 with Chrome
	'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.567 Mobile Safari/537.36',

	// iOS 15 with Safari
	'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
];

export function getRandomUserAgent(allowDesktop = true, allowMobile = true) {
	if(allowDesktop && allowMobile) {
		const allUserAgents = [ ...desktopUserAgents, ...mobileUserAgents ];
		return allUserAgents[ Math.floor(Math.random() * allUserAgents.length) ];
	} else if(allowDesktop) {
		return desktopUserAgents[ Math.floor(Math.random() * desktopUserAgents.length) ];
	} else if(allowMobile) {
		return mobileUserAgents[ Math.floor(Math.random() * mobileUserAgents.length) ];
	} else {
		throw new Error('At least one of allowDesktop or allowMobile must be true.');
	}
}

export async function extractAndSaveArticle(url, outputFileName) {
	try {
		// Launch a headless browser
		const browser = await puppeteer.launch();

		// Open a new page
		const page = await browser.newPage();
		await page.setUserAgent(getRandomUserAgent(true, false));

		// Navigate to the URL
		await page.goto(url);

		// Get the page content
		const content = await page.content();

		// Close the browser
		await browser.close();

		// Use node-readability to extract and format the article content
		read(content, { encoding: "utf-8" }, (err, readability) => {
			if(err) {
				console.error("Error extracting article content:", err);
				return;
			}

			// Get the extracted article content
			const articleContent = readability.content;

			// Save the formatted article content to the specified output file
			fs.writeFile(outputFileName, articleContent)
				.then(() => {
					console.log(`Article content saved to ${ outputFileName }`);
				})
				.catch((error) => {
					console.error("Error saving article content:", error);
				});
		});
	} catch(error) {
		console.error("Error extracting and saving article:", error);
	}
};

// Example usage:
const articleUrl = "https://www.business-standard.com/companies/news/google-rejected-play-store-fee-changes-due-to-revenue-impact-epic-lawsuit-123122400905_1.html";
const outputFile = "test.html";

extractAndSaveArticle(articleUrl, outputFile);


export default {
	extractAndSaveArticle,
};