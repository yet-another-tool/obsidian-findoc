import { COLORS } from "defaults";

let colors: string[] = [];

function resetColors(): void {
	colors = COLORS;
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
			value:
				parseFloat(line.split(",")[2]) !== 0
					? parseFloat(line.split(",")[2])
					: 0,
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
	if (d.getUTCMonth() + 1 < 10) return "0" + (d.getUTCMonth() + 1);
	return d.getUTCMonth() + 1;
}

function GetDate(d: Date): string | number {
	if (d.getUTCDate() < 10) return "0" + d.getUTCDate();
	return d.getUTCDate();
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

const functions: { [key: string]: any } = {
	splitByYear: (input: Array<IInput | any>) => {
		return input.reduce((acc, current) => {
			const d = new Date(current.timestamp);
			if (!acc[`${d.getUTCFullYear()}`]) {
				acc[`${d.getUTCFullYear()}`] = [];
			}
			acc[`${d.getUTCFullYear()}`].push(current);
			return acc;
		}, {});
	},

	splitByYearMonth: (input: Array<IInput | any>) => {
		return input.reduce((acc, current) => {
			const d = new Date(current.timestamp);
			if (!acc[`${d.getUTCFullYear()}-${getMonth(d)}`]) {
				acc[`${d.getUTCFullYear()}-${getMonth(d)}`] = [];
			}
			acc[`${d.getUTCFullYear()}-${getMonth(d)}`].push(current);
			console.debug(acc);
			return acc;
		}, {});
	},

	splitDailyDates: (input: Array<IInput | any>) => {
		return input.reduce((acc, current) => {
			const d = new Date(current.timestamp);
			const dateStr = `${d.getUTCFullYear()}-${getMonth(d)}-${GetDate(
				d
			)}`;

			if (!acc[dateStr]) {
				acc[dateStr] = [];
			}
			acc[dateStr].push(current);
			return acc;
		}, {});
	},

	generateSumDataSet: (
		typeToSelect: string[],
		input: { [key: string]: any[] },
		labels: string[],
		categories: string[]
	): IDataset => {
		const datasets = categories.map((category) => {
			const color = getColor();
			return {
				label: category,
				borderColor: color,
				fill: false,
				tension: 0.2,
				spanGaps: true,
				segment: {
					borderColor: (ctx: any) => skipped(ctx, color),
					borderDash: (ctx: any) => skipped(ctx, [3, 3]),
				},
				data: labels
					.map((label: string) => {
						return input[label]
							.filter((i: IInput) =>
								typeToSelect.includes(i.type)
							)
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
						if (current[category])
							categorySum.push(current[category]);
						else categorySum.push(0);
						return categorySum;
					}, []),
			};
		});
		return {
			labels,
			datasets,
		};
	},

	generateDailyDataSet: (
		typeToSelect: string[],
		input: { [key: string]: any[] },
		labels: string[],
		categories: string[]
	): IDataset => {
		const nonEmptyLabels: string[] = [];
		const datasets = categories.map((category) => {
			const color = getColor();
			return {
				label: category,
				borderColor: color,
				fill: false,
				tension: 0.2,
				spanGaps: true,
				segment: {
					borderColor: (ctx: any) => skipped(ctx, color),
					borderDash: (ctx: any) => skipped(ctx, [3, 3]),
				},
				data: labels
					.map((label: string) => {
						const categoriesFound = input[label]
							.filter((i: IInput) =>
								typeToSelect.includes(i.type)
							)
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
						if (current[category])
							categorySum.push(current[category]);
						else categorySum.push(NaN);
						return categorySum;
					}, []),
			};
		});

		return {
			labels: nonEmptyLabels,
			datasets,
		};
	},
};

const skipped = (ctx: any, value: string | Array<number>) =>
	ctx.p0.skip || ctx.p1.skip ? value : undefined;

function prepare(data: IDataset, beginAtZero = true): any {
	return {
		type: "line",
		data,
		options: {
			interaction: {
				intersect: false,
			},
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
							if (isNaN(currentValue)) return label;
							let previousValue: number = null;
							let firstValue: number = null;
							let change = 0;
							let symbol: "+" | "-" = "+";
							if (context.dataIndex - 1 >= 0) {
								previousValue =
									context.dataset.data[context.dataIndex - 1];
								if (previousValue === 0 || isNaN(previousValue))
									return label;
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

								label += ` => ${
									change !== 0 ? symbol : ""
								}${change.toFixed(2)}%`;

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
									label += ` > ${
										change !== 0 ? symbol : ""
									}${change.toFixed(2)}%`;
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

function processing(
	csvRawData: string,
	modelToGenerate: string,
	models: { [key: string]: any }
) {
	resetColors();
	const json = getData(csvRawData);
	const model = models[modelToGenerate];
	resetColors();

	const labels = Object.keys(functions[model.dataSource](json));
	const categories = getCategories(model.categories, json);
	const output: IDataset = functions[model.output](
		model.categories,
		functions[model.dataSource](json),
		labels,
		categories
	);

	return prepare(output, model.beginAtZero);
}

export default processing;
