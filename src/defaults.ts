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
	models: {
		expenses: {
			dataSource: "splitDailyDates",
			types: ["Income", "House Expenses", "Expenses"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			type: "money",
		},
		expensesMonthly: {
			dataSource: "splitByYearMonth",
			types: ["Income", "House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			type: "money",
		},
		portfolio: {
			dataSource: "splitDailyDates",
			types: ["Portfolio"],
			output: "generateDailyDataSet",
			beginAtZero: false,
			type: "money",
		},
		incomeYearly: {
			dataSource: "splitByYear",
			types: ["Income"],
			output: "generateSumDataSet",
			beginAtZero: true,
			type: "money",
		},
		income: {
			dataSource: "splitDailyDates",
			types: ["Income"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			type: "money",
		},
		all: {
			dataSource: "splitDailyDates",
			types: [
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
			type: "money",
		},
		mortgage: {
			dataSource: "splitDailyDates",
			types: ["Mortgage"],
			output: "generateDailyDataSet",
			beginAtZero: false,
			type: "money",
		},
		mortgageRate: {
			dataSource: "splitDailyDates",
			types: ["Mortgage Rate"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			type: "percent",
		},
		dividend: {
			dataSource: "splitByYearMonth",
			types: ["Dividend", "Cotisation"],
			output: "generateSumDataSetPerTypes",
			beginAtZero: true,
			type: "money",
		},
	},
	colors: COLORS,
	debounce: "1000",
	csvSeparator: ",",
};
