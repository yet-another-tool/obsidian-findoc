/*
 *	Functions to process the data
 */

import {
	IInput,
	IDataset,
	IContext,
	IReportData,
	IDataSourceKeys,
	IReportEntries,
	IReportMultiData,
} from "types";
import { getDate, getMonth, skipped } from "utils";

export const functions: { [key: string]: any } = {
	// SPLIT DATA (PREPARATION)
	splitBy: (input: Array<IInput | any>, key: IDataSourceKeys) => {
		return input.reduce((acc, current) => {
			if (!acc[current[key]]) {
				acc[current[key]] = [];
			}
			acc[current[key]].push(current);
			return acc;
		}, {});
	},

	splitByYear: (input: Array<IInput | any>, key: IDataSourceKeys) => {
		return input.reduce((acc, current) => {
			const d = new Date(current[key]);
			const timestamp = `${d.getUTCFullYear()}`;
			if (!acc[timestamp]) {
				acc[timestamp] = [];
			}
			acc[timestamp].push(current);
			return acc;
		}, {});
	},

	splitByYearMonth: (input: Array<IInput | any>, key: IDataSourceKeys) => {
		return input.reduce((acc, current) => {
			const d = new Date(current[key]);
			const timestamp = `${d.getUTCFullYear()}-${getMonth(d)}`;
			if (!acc[timestamp]) {
				acc[timestamp] = [];
			}
			acc[timestamp].push(current);
			return acc;
		}, {});
	},

	splitDailyDates: (input: Array<IInput | any>, key: IDataSourceKeys) => {
		return input.reduce((acc, current) => {
			const d = new Date(current[key]);
			const timestamp = `${d.getUTCFullYear()}-${getMonth(d)}-${getDate(
				d
			)}`;
			if (!acc[timestamp]) {
				acc[timestamp] = [];
			}
			acc[timestamp].push(current);
			return acc;
		}, {});
	},

	// GENERATORS

	generateSumDataSet: ({
		categoriesToSelect,
		input,
		labels,
		categories,
		colors,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		categories: string[];
		colors: string[];
	}): IDataset => {
		const usableColors = [...colors];
		const datasets = categories.map((category) => {
			const color = usableColors[0];
			usableColors.shift();

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
								categoriesToSelect.includes(i.category)
							)
							.reduce(
								(
									categories: { [key: string]: number },
									current: IInput
								) => {
									if (!categories[current.subcategory])
										categories[current.subcategory] = 0;
									categories[current.subcategory] +=
										current.value;
									return categories;
								},
								{}
							);
					})
					.reduce((typeSum, current) => {
						if (current[category]) typeSum.push(current[category]);
						else typeSum.push(0);
						return typeSum;
					}, []),
			};
		});
		return {
			labels,
			datasets,
		};
	},

	generateDailyDataSet: ({
		categoriesToSelect,
		input,
		labels,
		categories,
		colors,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		categories: string[];
		colors: string[];
	}): IDataset => {
		const nonEmptyLabels: string[] = [];
		const usableColors = [...colors];
		const datasets = categories.map((category) => {
			const color = usableColors[0];
			usableColors.shift();
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
								categoriesToSelect.includes(i.category)
							)
							.reduce(
								(
									categories: { [key: string]: number },
									current: IInput
								) => {
									if (!categories[current.subcategory])
										categories[current.subcategory] = 0;
									categories[current.subcategory] =
										current.value;
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
					.reduce((typeSum, current) => {
						if (current[category]) typeSum.push(current[category]);
						else typeSum.push(NaN);
						return typeSum;
					}, []),
			};
		});

		return {
			labels: nonEmptyLabels,
			datasets,
		};
	},

	generateSumDataSetPerTypes: ({
		categoriesToSelect,
		input,
		labels,
		colors,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		colors: string[];
	}): IDataset => {
		const usableColors = [...colors];
		const datasets = categoriesToSelect.map((category) => {
			const color = usableColors[0];
			usableColors.shift();
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
				data: Object.values(input).map((i) => {
					return i
						.filter((entry) => entry.category === category)
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

	getLastValuePerTypeForCurrentMonth: ({
		categoriesToSelect,
		input,
		date = undefined,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		date: string | undefined;
	}): IReportData => {
		// TODO: at some point this Date must be configurable.
		let d = new Date();
		if (date) d = new Date(date);

		// Select current month dataset
		const lastInput = input[`${d.getUTCFullYear()}-${getMonth(d)}`] || [];
		// TECH. DEBT !
		// Keeping only last reference for a month.
		// When this is : Portfolio category.
		const _lastInput: IInput[] = [];
		lastInput.reverse().forEach((li) => {
			if (li.category !== "Portfolio") _lastInput.push(li);
			if (_lastInput.every((_li) => _li.subcategory !== li.subcategory))
				_lastInput.push(li);
		});

		const datasets = categoriesToSelect.map((category) => {
			// Get Last item from our input array
			return {
				label: category,
				// Get the sum of all data for the specified category
				data: _lastInput
					.filter((entry) => entry.category === category)
					.reduce((acc, current) => {
						acc += current.value;
						return acc;
					}, 0),
				date: `${d.getUTCFullYear()}-${getMonth(d)}`,
			};
		});

		return {
			datasets,
		};
	},

	generateCumulativeSumDataSet: ({
		categoriesToSelect,
		input,
		labels,
		categories,
		colors,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		categories: string[];
		colors: string[];
	}): IDataset => {
		const usableColors = [...colors];
		const datasets = categories.map((category) => {
			const color = usableColors[0];
			usableColors.shift();

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
								categoriesToSelect.includes(i.category)
							)
							.reduce(
								(
									categories: { [key: string]: number },
									current: IInput
								) => {
									if (!categories[current.subcategory])
										categories[current.subcategory] = 0;
									categories[current.subcategory] +=
										current.value;
									return categories;
								},
								{}
							);
					})
					.reduce((typeSum, current) => {
						if (current[category]) typeSum.push(current[category]);
						else typeSum.push(0);
						return typeSum;
					}, [])
					// Cumulative Sum
					.map(
						(value: number, index: number, array: number[]) =>
							value +
							array
								.slice(0, index) // take previous value
								.reduce((acc, v) => (acc += v), 0) // sum all of them
					),
			};
		});
		return {
			labels,
			datasets,
		};
	},

	generateCumulativeSumDataSetPerTypes: ({
		categoriesToSelect,
		input,
		labels,
		colors,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		colors: string[];
	}): IDataset => {
		const usableColors = [...colors];
		const datasets = categoriesToSelect.map((category) => {
			const color = usableColors[0];
			usableColors.shift();
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
				data: Object.values(input)
					.map((i) => {
						return i
							.filter((entry) => entry.category === category)
							.reduce((acc, current) => {
								acc += current.value;
								return acc;
							}, 0);
					})
					// Cumulative Sum
					.map(
						(value, index, array) =>
							value +
							array
								.slice(0, index) // take previous value
								.reduce((acc, v) => (acc += v), 0) // sum all of them
					),
			};
		});

		return {
			labels,
			datasets,
		};
	},

	generateDifference: ({
		categoriesToSelect,
		input,
		labels,
		colors,
		values,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		colors: string[];
		values: string[]; // Example: [Income, Expenses]
	}): IDataset => {
		const usableColors = [...colors];
		const color = usableColors[0];
		usableColors.shift();

		const dataToProcess: { [key: string]: number[] } = {};

		categoriesToSelect.forEach((category) => {
			dataToProcess[category] = Object.values(input).map((i) => {
				return i
					.filter((entry) => entry.category === category)
					.reduce((acc, current) => {
						acc += current.value;
						return acc;
					}, 0);
			});
		});

		const datasets = [
			{
				label: `${values[0]} - ${values[1]}`,
				borderColor: color,
				fill: false,
				tension: 0.2,
				spanGaps: true,
				segment: {
					borderColor: (ctx: IContext) => skipped(ctx, color),
					borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
				},
				data: dataToProcess[values[0].trim()].map(
					(n: number, idx: number) =>
						n - dataToProcess[values[1].trim()][idx]
				),
			},
		];

		return {
			labels,
			datasets,
		};
	},

	generateCumulativeDifference: ({
		categoriesToSelect,
		input,
		labels,
		colors,
		values,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		colors: string[];
		values: string[]; // Example: [Income, Expenses]
	}): IDataset => {
		const usableColors = [...colors];
		const color = usableColors[0];
		usableColors.shift();

		const dataToProcess: { [key: string]: number[] } = {};

		categoriesToSelect.forEach((category) => {
			dataToProcess[category] = Object.values(input).map((i) => {
				return i
					.filter((entry) => entry.category === category)
					.reduce((acc, current) => {
						acc += current.value;
						return acc;
					}, 0);
			});
		});

		const datasets = [
			{
				label: `${values[0]} - ${values[1]}`,
				borderColor: color,
				fill: false,
				tension: 0.2,
				spanGaps: true,
				segment: {
					borderColor: (ctx: IContext) => skipped(ctx, color),
					borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
				},
				data: dataToProcess[values[0].trim()].map(
					(n: number, idx: number) =>
						n - dataToProcess[values[1].trim()][idx]
				),
			},
		];

		return {
			labels,
			datasets,
		};
	},

	generateSum: ({
		categoriesToSelect,
		input,
		labels,
		colors,
		values,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		colors: string[];
		values: string[]; // Example: [House Expenses, Expenses]
	}): IDataset => {
		const usableColors = [...colors];
		const color = usableColors[0];
		usableColors.shift();

		const dataToProcess: { [key: string]: number[] } = {};

		categoriesToSelect.forEach((category) => {
			dataToProcess[category] = Object.values(input).map((i) => {
				return i
					.filter((entry) => entry.category === category)
					.reduce((acc, current) => {
						acc += current.value;
						return acc;
					}, 0);
			});
		});

		const datasets = [
			{
				label: `${values[0]} + ${values[1]}`,
				borderColor: color,
				fill: false,
				tension: 0.2,
				spanGaps: true,
				segment: {
					borderColor: (ctx: IContext) => skipped(ctx, color),
					borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
				},
				data: dataToProcess[values[0].trim()].map(
					(n: number, idx: number) =>
						n + dataToProcess[values[1].trim()][idx]
				),
			},
		];

		return {
			labels,
			datasets,
		};
	},

	reportDifference: ({
		categoriesToSelect,
		input,
		values,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		values: string[]; // Example: [Income, Expenses]
	}): IReportMultiData => {
		const dataToProcess: { [key: string]: number[] } = {};

		categoriesToSelect.forEach((category) => {
			dataToProcess[category] = Object.values(input).map((i) => {
				return i
					.filter((entry) => entry.category === category)
					.reduce((acc, current) => {
						acc += current.value;
						return acc;
					}, 0);
			});
		});

		const datasets: IReportEntries = {
			label: `${values[0]} - ${values[1]}`,
			data: dataToProcess[values[0].trim()].map(
				(n: number, idx: number) =>
					n - dataToProcess[values[1].trim()][idx]
			),
			labels: Object.keys(input),
		};

		return {
			datasets,
		};
	},

	reportSum: ({
		categoriesToSelect,
		input,
		values,
	}: {
		categoriesToSelect: string[];
		input: { [key: string]: IInput[] };
		values: string[]; // Example: [Income, Expenses]
	}): IReportMultiData => {
		const dataToProcess: { [key: string]: number[] } = {};

		categoriesToSelect.forEach((category) => {
			dataToProcess[category] = Object.values(input).map((i) => {
				return i
					.filter((entry) => entry.category === category)
					.reduce((acc, current) => {
						acc += current.value;
						return acc;
					}, 0);
			});
		});

		const datasets: IReportEntries = {
			label: `${values[0]} + ${values[1]}`,
			data: dataToProcess[values[0].trim()].map(
				(n: number, idx: number) =>
					n + dataToProcess[values[1].trim()][idx]
			),
			labels: Object.keys(input),
		};

		return {
			datasets,
		};
	},
};
