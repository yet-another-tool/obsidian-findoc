import { IPluginSettings } from "types";

export const HEADER = "Category,Subcategory,Value,TimeStamp,Extra";

export const COLORS: string[] = [
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
];

export const DEFAULT_SETTINGS: IPluginSettings = {
	chartLabelTypes: ["money", "percent", "generic", "custom"],
	minCharsToMatch: 1,
	useAutocomplete: true,
	categories: [
		"Portfolio",
		"Income",
		"Mortgage",
		"Mortgage Rate",
		"Cotisation",
		"Dividend",
		"House Expenses",
		"Expenses",
		"Generic",
	],
	useLastElementAsTemplate: true,
	models: {
		expenses: {
			dataSource: "splitDailyDates",
			categories: ["Income", "House Expenses", "Expenses"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		expensesMonthly: {
			dataSource: "splitByYearMonth",
			categories: ["Income", "House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		portfolio: {
			dataSource: "splitDailyDates",
			categories: ["Portfolio"],
			output: "generateDailyDataSet",
			beginAtZero: false,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		incomeYearly: {
			dataSource: "splitByYear",
			categories: ["Income"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		income: {
			dataSource: "splitDailyDates",
			categories: ["Income"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		all: {
			dataSource: "splitDailyDates",
			categories: [
				"Portfolio",
				"Income",
				"Mortgage",
				"Mortgage Rate",
				"Cotisation",
				"Dividend",
				"House Expenses",
				"Expenses",
			],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		mortgage: {
			dataSource: "splitDailyDates",
			categories: ["Mortgage"],
			output: "generateDailyDataSet",
			beginAtZero: false,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		mortgageRate: {
			dataSource: "splitDailyDates",
			categories: ["Mortgage Rate"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "percent",
			dataSourceKey: "timestamp",
			values: "",
		},
		dividend: {
			dataSource: "splitByYearMonth",
			categories: ["Dividend", "Cotisation"],
			output: "generateSumDataSetPerTypes",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		portfolioReport: {
			dataSource: "splitByYearMonth",
			categories: [
				"Portfolio",
				"Income",
				"Cotisation",
				"Expenses",
				"House Expenses",
				"Dividend",
			],
			output: "getLastValuePerTypeForCurrentMonth",
			beginAtZero: false,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		cumulativeSum: {
			dataSource: "splitByYearMonth",
			categories: [
				"Portfolio",
				"Income",
				"Cotisation",
				"Expenses",
				"House Expenses",
				"Dividend",
			],
			output: "generateCumulativeSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		cumulativeSumPerTypes: {
			dataSource: "splitByYearMonth",
			categories: [
				"Portfolio",
				"Income",
				"Cotisation",
				"Expenses",
				"House Expenses",
				"Dividend",
			],
			output: "generateCumulativeSumDataSetPerTypes",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		cumulativeSumForCotisationSplitByExtra: {
			dataSource: "splitBy",
			categories: ["Cotisation"],
			output: "generateCumulativeSumDataSetPerTypes",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "extra",
			values: "",
		},
		incomeMinusExpensesByYearMonth: {
			dataSource: "splitByYearMonth",
			categories: ["Income", "Expenses"],
			output: "generateDifference",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Income, Expenses", // Yield: Income - Expenses
		},
		expensesPlusHouseExpensesByYearMonth: {
			dataSource: "splitByYearMonth",
			categories: ["Expenses", "House Expenses"],
			output: "generateSum",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Expenses, House Expenses", // Yield: Expenses + House Expenses
		},
		incomeMinusExpensesByYearMonthReport: {
			dataSource: "splitByYearMonth",
			categories: ["Income", "Expenses"],
			output: "reportDifference",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Income, Expenses", // Yield: Income - Expenses
		},
		expensesPlusHouseExpensesByYearMonthReport: {
			dataSource: "splitByYearMonth",
			categories: ["Expenses", "House Expenses"],
			output: "reportSum",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Expenses, House Expenses", // Yield: Expenses + House Expenses
		},
		incomeMinusExpensesByDaily: {
			dataSource: "splitDailyDates",
			categories: ["Income", "Expenses"],
			output: "generateCumulativeDifference",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Income, Expenses", // Yield: Income - Expenses
		},
		incomesExpensesYearly: {
			dataSource: "splitByYear",
			categories: ["Income", "House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		expensesOnlyMonthly: {
			dataSource: "splitByYearMonth",
			categories: ["House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		expensesOnlyDaily: {
			dataSource: "splitDailyDates",
			categories: ["House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		expensesOnlyYearly: {
			dataSource: "splitByYear",
			categories: ["House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
	},
	colors: COLORS,
	debounce: "1000",
	csvSeparator: ",",
};
