/*
 *	Functions to process the data
 */

import { getColor } from "colors";
import { getDate, getMonth, skipped } from "utils";

export const functions: { [key: string]: any } = {
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
			return acc;
		}, {});
	},

	splitDailyDates: (input: Array<IInput | any>) => {
		return input.reduce((acc, current) => {
			const d = new Date(current.timestamp);
			const dateStr = `${d.getUTCFullYear()}-${getMonth(d)}-${getDate(
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
		input: { [key: string]: IInput[] },
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
					borderColor: (ctx: IContext) => skipped(ctx, color),
					borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
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
		input: { [key: string]: IInput[] },
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
					borderColor: (ctx: IContext) => skipped(ctx, color),
					borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
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

	generateSumDataSetPerTypes: (
		typeToSelect: string[],
		input: { [key: string]: IInput[] },
		labels: string[]
	): IDataset => {
		const datasets = typeToSelect.map((type) => {
			const color = getColor();
			return {
				label: type,
				borderColor: color,
				fill: false,
				tension: 0.2,
				spanGaps: true,
				segment: {
					borderColor: (ctx: IContext) => skipped(ctx, color),
					borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
				},
				data: Object.values(input).map((i) => {
					return i
						.filter((entry) => entry.type === type)
						.reduce((acc, current) => {
							acc += current.value;
							return acc;
						}, 0);
				}),
			};
		});

		return {
			labels,
			datasets,
		};
	},
};
