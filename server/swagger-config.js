import swaggerAutogen from "swagger-autogen";

const doc = {
	info: {
		title: "Investor",
		description: "API Docs",
	},
	host: "kiszka.com:3801",
	schemes: [ "https" ],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [ "./routes/file.js" ];

swaggerAutogen(outputFile, endpointsFiles, doc);
