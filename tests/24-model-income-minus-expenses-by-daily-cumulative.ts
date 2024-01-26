// npx tsx tests/24-model-income-minus-expenses-by-daily-cumulative.ts
// Income Minus Expenses By Year Month,
// But instead it adds up Cumulative than takes the Cumulative,
// and for daily not yearly / monthly

// IE
// Income[1,2,3,4,5,6,7,8,9,10] - Expenses[1,2,3,4]
// 55 - 10

import path from "node:path";
import { loadCSV } from "./operations";
import { getData } from "csv";
import { functions } from "methods";
import { getCategories } from "processing";

const rawData = loadCSV([path.join(__dirname, "24.csv")]);
const json = getData(rawData, ",");
const dataSplitDaily = functions.splitDailyDates(json, "timestamp");

// Income: [
//     0, 30, 10,  0, 10, 10, 10, 40,
//    10, 10,  0, 10, 10, 10, 10, 10,
//    10, 10, 10, 10, 20, 80, 20, 20,
//    20, 20
//  ],
//  Expenses: [
//    5, 20, 10, 10,  0, 0, 130,  0,
//    0,  0, 10,  0, 20, 0,   0, 20,
//    0,  0,  0,  0,  0, 0,   0,  0,
//    0,  0,  0
//  ]

// const data = [
// 	-5, 10, 0, -10, 10, 10, -120, 40, 10, 10, -10, 10, -10, 10, 10, -10, 10, 10,
// 	10, 10, 20, 80, 20, 20, 20, 20,
// ];

const chartDataCumulativeDifference = functions.generateCumulativeDifference({
	categoriesToSelect: ["Income", "Expenses"],
	input: dataSplitDaily,
	labels: Object.keys(dataSplitDaily),
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

console.debug(JSON.stringify(chartDataCumulativeDifference, null, 2));
