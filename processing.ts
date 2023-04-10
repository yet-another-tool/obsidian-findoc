interface IInput {
	type: string;
	id: string;
	value: number;
	timestamp: Date;
	extra: string;
}

interface IDataset {
	labels: string[];
	datasets: {
		label: string;
		borderColor: string;
		fill: boolean;
		tension: number;
		data: any;
	}[];
}

interface ITooltip {
	dataset: {
		label: string;
		data: any[];
	};
	parsed: {
		y: number;
	};
	dataIndex: number;
}

const MODELS: { [key: string]: any } = {
	expenses: {
		dataSource: splitDailyDates,
		categories: ["Income", "House Expenses"],
		output: generateDailyDataSet,
		beginAtZero: true,
	},
	expensesMonthly: {
		dataSource: splitByYearMonth,
		categories: ["Income", "House Expenses"],
		output: generateSumDataSet,
		beginAtZero: true,
	},
	portfolio: {
		dataSource: splitDailyDates,
		categories: ["Portfolio"],
		output: generateDailyDataSet,
		beginAtZero: false,
	},
	incomeYearly: {
		dataSource: splitByYear,
		categories: ["Income"],
		output: generateSumDataSet,
		beginAtZero: true,
	},
	income: {
		dataSource: splitDailyDates,
		categories: ["Income"],
		output: generateDailyDataSet,
		beginAtZero: true,
	},
	all: {
		dataSource: splitDailyDates,
		categories: [
			"Portfolio",
			"Income",
			"Mortgage",
			"Mortgage Rate",
			"Cotisation",
			"Dividend",
			"House Expenses",
		],
		output: generateDailyDataSet,
		beginAtZero: true,
	},
	mortgage: {
		dataSource: splitDailyDates,
		categories: ["Mortgage"],
		output: generateDailyDataSet,
		beginAtZero: false,
	},
	mortgageRate: {
		dataSource: splitDailyDates,
		categories: ["Mortgage Rate"],
		output: generateDailyDataSet,
		beginAtZero: true,
	},
	dividend: {
		dataSource: splitByYearMonth,
		categories: ["Dividend", "Cotisation"],
		output: generateSumDataSet,
		beginAtZero: true,
	},
};
let colors: string[] = [];

function resetColors(): void {
	colors = [
		"#003049",
		"#D62828",
		"#F77F00",
		"#FCBF49",
		"#EAE2B7",
		"#8ecae6",
		"#219ebc",
		"#023047",
		"#ffb703",
		"#fb8500",
		"#ffbe0b",
		"#fb5607",
		"#ff006e",
		"#8338ec",
		"#3a86ff",
		"#390099",
		"#9e0059",
		"#ff0054",
		"#ff5400",
		"#ffbd00",
		"#619b8a",
		"#7678ed",
		"#2f4858",
		"#33658a",
		"#ce6a85",
		"#985277",
		"#5c374c",
		"#31393c",
		"#2176ff",
		"#33a1fd",
		"#fdca40",
		"#f79824",
	];
}

function getColor(): string {
	const c = colors[0];
	colors.shift();

	return c;
}

function getData(csv: string): Array<IInput> {
	return csv
		.split("\n")
		.filter((line, idx) => idx !== 0)
		.filter((line) => line !== "")
		.map((line) => ({
			type: line.split(",")[0],
			id: line.split(",")[1],
			value: parseFloat(line.split(",")[2]),
			timestamp: new Date(line.split(",")[3]),
			extra: line.split(",")[4],
		}))
		.sort((a, b) => {
			return (
				new Date(a.timestamp).getTime() -
				new Date(b.timestamp).getTime()
			);
		});
}

function getMonth(d: Date): string | number {
	if (d.getMonth() + 1 < 10) return "0" + (d.getMonth() + 1);
	return d.getMonth() + 1;
}

function GetDate(d: Date): string | number {
	if (d.getDate() < 10) return "0" + d.getDate();
	return d.getDate();
}

function splitByYear(input: Array<IInput | any>) {
	return input.reduce((acc, current) => {
		const d = new Date(current.timestamp);
		if (!acc[`${d.getFullYear()}`]) {
			acc[`${d.getFullYear()}`] = [];
		}
		acc[`${d.getFullYear()}`].push(current);
		return acc;
	}, {});
}

function splitByYearMonth(input: Array<IInput | any>) {
	return input.reduce((acc, current) => {
		const d = new Date(current.timestamp);
		if (!acc[`${d.getFullYear()}-${getMonth(d)}`]) {
			acc[`${d.getFullYear()}-${getMonth(d)}`] = [];
		}
		acc[`${d.getFullYear()}-${getMonth(d)}`].push(current);
		return acc;
	}, {});
}

function splitDailyDates(input: Array<IInput | any>) {
	return input.reduce((acc, current) => {
		const d = new Date(current.timestamp);
		const dateStr = `${d.getFullYear()}-${getMonth(d)}-${GetDate(d)}`;

		if (!acc[dateStr]) {
			acc[dateStr] = [];
		}
		acc[dateStr].push(current);
		return acc;
	}, {});
}

function getCategories(
	categoriesToSelect: string[],
	input: Array<IInput | any>
) {
	return Object.values(input)
		.filter((line) => categoriesToSelect.includes(line.type))
		.reduce((categories, current) => {
			if (!categories.includes(current.id)) categories.push(current.id);
			return categories;
		}, []);
}

function generateSumDataSet(
	typeToSelect: string[],
	input: { [key: string]: any[] },
	labels: string[],
	categories: string[]
): IDataset {
	const datasets = categories.map((category) => {
		return {
			label: category,
			borderColor: getColor(),
			fill: false,
			tension: 0.2,
			data: labels
				.map((label: string) => {
					return input[label]
						.filter((i: IInput) => typeToSelect.includes(i.type))
						.reduce(
							(
								categories: { [key: string]: number },
								current: IInput
							) => {
								if (!categories[current.id])
									categories[current.id] = 0;
								categories[current.id] += current.value;
								return categories;
							},
							{}
						);
				})
				.reduce((categorySum, current) => {
					if (current[category]) categorySum.push(current[category]);
					else categorySum.push(0);
					return categorySum;
				}, []),
		};
	});
	return {
		labels,
		datasets,
	};
}

function generateDailyDataSet(
	typeToSelect: string[],
	input: { [key: string]: any[] },
	labels: string[],
	categories: string[]
): IDataset {
	const nonEmptyLabels: string[] = [];
	const datasets = categories.map((category) => {
		return {
			label: category,
			borderColor: getColor(),
			fill: false,
			tension: 0.2,
			data: labels
				.map((label: string) => {
					const categoriesFound = input[label]
						.filter((i: IInput) => typeToSelect.includes(i.type))
						.reduce(
							(
								categories: { [key: string]: number },
								current: IInput
							) => {
								if (!categories[current.id])
									categories[current.id] = 0;
								categories[current.id] = current.value;
								return categories;
							},
							{}
						);
					if (
						Object.keys(categoriesFound).length > 0 &&
						!nonEmptyLabels.includes(label)
					)
						nonEmptyLabels.push(label);

					return categoriesFound;
				})
				.filter((current) => {
					let total = 0;
					Object.values(current).forEach((c: number) => {
						total += c;
					});

					if (total === 0) return null;
					return current;
				})
				.reduce((categorySum, current) => {
					if (current[category]) categorySum.push(current[category]);
					else categorySum.push(0);
					return categorySum;
				}, []),
		};
	});

	return {
		labels: nonEmptyLabels,
		datasets,
	};
}

function prepare(data: IDataset, beginAtZero = true): any {
	return {
		type: "line",
		data,
		options: {
			scales: {
				y: {
					beginAtZero,
				},
			},
			plugins: {
				tooltip: {
					callbacks: {
						label: function (context: ITooltip) {
							let label = context.dataset.label || "";

							if (label) {
								label += ": ";
							}
							if (context.parsed.y !== null) {
								label += new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "USD",
								}).format(context.parsed.y);
							}

							const currentValue: number = context.parsed.y;
							let previousValue: number = null;
							let firstValue: number = null;
							let change = 0;
							let symbol: "+" | "-" = "+";
							if (context.dataIndex - 1 >= 0) {
								previousValue =
									context.dataset.data[context.dataIndex - 1];
								if (previousValue === 0) return label;
								if (currentValue > previousValue) {
									symbol = "+";
									change =
										((currentValue - previousValue) /
											previousValue) *
										100;
								} else {
									symbol = "-";
									change =
										((previousValue - currentValue) /
											previousValue) *
										100;
								}

								label += ` => ${symbol}${change.toFixed(2)}%`;

								if (
									context.dataIndex ===
									context.dataset.data.length - 1
								) {
									firstValue = context.dataset.data[0];
									if (firstValue === 0) return label;
									if (currentValue > firstValue) {
										symbol = "+";
										change =
											((currentValue - firstValue) /
												firstValue) *
											100;
									} else {
										symbol = "-";
										change =
											((firstValue - currentValue) /
												firstValue) *
											100;
									}
									label += ` > ${symbol}${change.toFixed(
										2
									)}%`;
								}
							}
							return label;
						},
					},
				},
			},
		},
	};
}

function processing(csvRawData: string, modelToGenerate: string) {
	resetColors();
	const json = getData(csvRawData);
	const model = MODELS[modelToGenerate];
	resetColors();
	const labels = Object.keys(model.dataSource(json));
	const categories = getCategories(model.categories, json);
	const output: IDataset = model.output(
		model.categories,
		model.dataSource(json),
		labels,
		categories
	);

	return prepare(output, model.beginAtZero);
}

export default processing;
