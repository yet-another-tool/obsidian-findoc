// npx tsx tests/flow.ts
import path from "node:path";
import { loadCSV } from "./operations";
import { getData } from "csv";
import { functions } from "methods";
import { getCategories } from "processing";

const rawData = loadCSV([path.join(__dirname, "data.csv")]);
const json = getData(rawData, ",");

console.debug(rawData);
console.debug(json);

// SPLIT DATA

const dataSplitByYear = functions.splitByYear(json);
console.debug(dataSplitByYear);

const dataSplitByYearMonth = functions.splitByYearMonth(json);
console.debug(dataSplitByYearMonth);

const dataSplitDaily = functions.splitDailyDates(json);
console.debug(dataSplitDaily);

// Allow to use other keys or strategy to split the json
const dataSplitByKeyExtra = functions.splitBy(json, "extra");
console.debug(dataSplitByKeyExtra);

// Allow to use other keys or strategy to split the json
const dataSplitByKeyValue = functions.splitBy(json, "value");
console.debug(dataSplitByKeyValue);

// GENERATORS (dataSource)

const chartDataSplitByYearMonth = functions.generateSumDataSet({
	categoriesToSelect: ["Income", "Portfolio"],
	input: dataSplitByYearMonth,
	labels: Object.keys(dataSplitByYearMonth),
	categories: getCategories(["Income", "Portfolio"], json),
	colors: [
		"#1ac18f",
		"#EAE2B7",
		"#8ecae6",
		"#219ebc",
		"#026597",
		"#be37a5",
		"#fb8500",
		"#ffbe0b",
		"#fff5b8",
		"#ff006e",
		"#8338ec",
		"#3a86ff",
		"#390099",
		"#9e0059",
		"#8c3b56",
		"#ff5400",
		"#ffbd00",
		"#619b8a",
		"#7678ed",
		"#c2e83b",
		"#33658a",
		"#ce6a85",
		"#985277",
		"#5c374c",
		"#ba66ff",
		"#2176ff",
		"#33a1fd",
		"#7cd671",
		"#22def7",
	],
});
console.debug(chartDataSplitByYearMonth);
