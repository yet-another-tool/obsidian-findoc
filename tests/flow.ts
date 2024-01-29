// npx tsx tests/flow.ts
import path from "node:path";
import { difference, loadCSV, sum } from "./operations";
import { getData } from "csv";
import { functions, splitBy } from "methods";
import { getCategories } from "processing";
import { IInput } from "types";

const rawData = loadCSV([path.join(__dirname, "data.csv")]);
const json = getData(rawData, ",");

// console.debug(rawData);
// console.debug(json);

// SPLIT DATA

// const dataSplitByYear = functions.splitByYear.exec(json, "timestamp");
// console.debug(dataSplitByYear);

const dataSplitByYearMonth: { [key: string]: IInput[] } =
	splitBy.splitByYearMonth.exec(json, "timestamp");
// console.debug(dataSplitByYearMonth);

// const dataSplitDaily = functions.splitDailyDates.exec(json, "timestamp");
// console.debug(dataSplitDaily);

// Allow to use other keys or strategy to split the json
// const dataSplitByKeyExtra = functions.splitBy.exec(json, "extra");
// console.debug(dataSplitByKeyExtra);

// Allow to use other keys or strategy to split the json
// const dataSplitByKeyValue = functions.splitBy.exec(json, "value");
// console.debug(dataSplitByKeyValue);

// GENERATORS (dataSource)

// const chartDataSplitByYearMonth = functions.generateSumDataSet.exec({
// 	categoriesToSelect: ["Income", "Portfolio"],
// 	input: dataSplitByYearMonth,
// 	labels: Object.keys(dataSplitByYearMonth),
// 	categories: getCategories(["Income", "Portfolio"], json),
// 	colors: [
// 		"#1ac18f",
// 		"#EAE2B7",
// 		"#8ecae6",
// 		"#219ebc",
// 		"#026597",
// 		"#be37a5",
// 		"#fb8500",
// 		"#ffbe0b",
// 		"#fff5b8",
// 		"#ff006e",
// 		"#8338ec",
// 		"#3a86ff",
// 		"#390099",
// 		"#9e0059",
// 		"#8c3b56",
// 		"#ff5400",
// 		"#ffbd00",
// 		"#619b8a",
// 		"#7678ed",
// 		"#c2e83b",
// 		"#33658a",
// 		"#ce6a85",
// 		"#985277",
// 		"#5c374c",
// 		"#ba66ff",
// 		"#2176ff",
// 		"#33a1fd",
// 		"#7cd671",
// 		"#22def7",
// 	],
// });
// console.debug(chartDataSplitByYearMonth);

// const chartDataSplitByExtraKey = functions.generateSumDataSet({
// 	categoriesToSelect: ["Cotisation"],
// 	input: dataSplitByKeyExtra,
// 	labels: Object.keys(dataSplitByKeyExtra),
// 	categories: getCategories(["Cotisation"], json),
// 	colors: [
// 		"#1ac18f",
// 		"#EAE2B7",
// 		"#8ecae6",
// 		"#219ebc",
// 		"#026597",
// 		"#be37a5",
// 		"#fb8500",
// 		"#ffbe0b",
// 		"#fff5b8",
// 		"#ff006e",
// 		"#8338ec",
// 		"#3a86ff",
// 		"#390099",
// 		"#9e0059",
// 		"#8c3b56",
// 		"#ff5400",
// 		"#ffbd00",
// 		"#619b8a",
// 		"#7678ed",
// 		"#c2e83b",
// 		"#33658a",
// 		"#ce6a85",
// 		"#985277",
// 		"#5c374c",
// 		"#ba66ff",
// 		"#2176ff",
// 		"#33a1fd",
// 		"#7cd671",
// 		"#22def7",
// 	],
// });
// console.debug(chartDataSplitByExtraKey);

// console.debug(dataSplitByYearMonth);

const result: { [key: string]: any } = {};
["Income", "Expenses"].forEach(
	(category) =>
		(result[category] = Object.values(dataSplitByYearMonth).map((i) => {
			return i
				.filter((entry) => entry.category === category)
				.reduce((acc, current) => {
					acc += current.value;
					return acc;
				}, 0);
		}))
);
console.log(result);

// [
// 	[
// 		 0, 1500,    4300,
// 	  2000, 1800,    2150,
// 	  2300, 1300, 3230.66,
// 	  4210, 3000,    2200,
// 	  1900
// 	],
// 	[
// 		  0,     0,    11000,
// 	  11300, 13300,    18300,
// 	  15000, 16000, 17333.33,
// 	  20890, 16000,    22800,
// 	  20200
// 	]
//   ]

const diff = difference(result["Income"], result["Expenses"]);
console.log(diff);

const diff2 = difference(result["Expenses"], result["Income"]);
console.log(diff2);

// [
// 	0,   1500,
// -6700,  -9300,
// -11500, -16150,
// -12700, -14700,
// -14102.670000000002, -16680,
// -13000, -20600,
// -18300
// ]

const sum1 = sum(result["Income"], result["Expenses"]);
console.log(sum1);

const sum2 = sum(result["Expenses"], result["Income"]);
console.log(sum2);

// [
// 	0,  1500,
// 15300, 13300,
// 15100, 20450,
// 17300, 17300,
// 20563.99, 25100,
// 19000, 25000,
// 22100
// ]
// [
// 	0,  1500,
// 15300, 13300,
// 15100, 20450,
// 17300, 17300,
// 20563.99, 25100,
// 19000, 25000,
// 22100
// ]

// ---
const chartDataDifference = functions.generateDifference.exec({
	categoriesToSelect: ["Income", "Expenses"],
	input: dataSplitByYearMonth,
	labels: Object.keys(dataSplitByYearMonth),
	categories: getCategories(["Income", "Expenses"], json),
	values: ["Income", "Expenses"],
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
console.debug(JSON.stringify(chartDataDifference));
