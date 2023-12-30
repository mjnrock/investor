import { v4 as uuid } from "uuid";
import { APIDataSource, APIHelper, EnumAPIType } from "./APIDataSource.js";

export class NewsAPI extends APIDataSource {
	static Modeler(data) {
		const feed = data.feed;
		return feed.map(article => ({
			uuid: uuid(),
			title: article.title,
			url: article.url,
			timePublished: article.time_published,
			authors: article.authors,
			summary: article.summary,
			bannerImage: article.banner_image,
			source: article.source,
			categoryWithinSource: article.category_within_source,
			sourceDomain: article.source_domain,
			topics: article.topics,
			overallSentimentScore: article.overall_sentiment_score,
			overallSentimentLabel: article.overall_sentiment_label,
			tickerSentiment: article.ticker_sentiment,
		}));
	}

	static Analyzer(data) {
		return {
			items: data.items,
			sentimentScoreDefinition: data.sentiment_score_definition,
			relevanceScoreDefinition: data.relevance_score_definition
		};
	}

	constructor (opts = {}) {
		super({
			apiType: EnumAPIType.NEWS,
			...opts,
		});

		this.modeler = NewsAPI.Modeler;
		this.analyzer = NewsAPI.Analyzer;
	}

	static Create(opts = {}) {
		return new this(opts);
	}

	setTickers(tickers) {
		this.state.params.tickers = tickers;
		return this;
	}

	setTopics(topics) {
		this.state.params.topics = topics;
		return this;
	}

	setTimeRange(timeFrom, timeTo) {
		this.state.params.time_from = timeFrom;
		this.state.params.time_to = timeTo;
		return this;
	}

	setSort(sort) {
		this.state.params.sort = sort;
		return this;
	}

	setLimit(limit) {
		this.state.params.limit = limit;
		return this;
	}
};

export default NewsAPI;