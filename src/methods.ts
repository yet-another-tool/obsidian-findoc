/*
 *	Functions to process the data
 */

import { getDate, getMonth, skipped } from "utils";

export const functions: { [key: string]: any } = {
	splitByYear: (input: Array<IInput | any>) => {
		console.log(input);
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

	generateSumDataSet: ({
		typeToSelect,
		input,
		labels,
		types,
		colors,
	}: {
		typeToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		types: string[];
		colors: string[];
	}): IDataset => {
		const usableColors = [...colors];
		const datasets = types.map((type) => {
			const color = usableColors[0];
			usableColors.shift();

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
				data: labels
					.map((label: string) => {
						return input[label]
							.filter((i: IInput) =>
								typeToSelect.includes(i.type)
							)
							.reduce(
								(
									types: { [key: string]: number },
									current: IInput
								) => {
									if (!types[current.id])
										types[current.id] = 0;
									types[current.id] += current.value;
									return types;
								},
								{}
							);
					})
					.reduce((typeSum, current) => {
						if (current[type]) typeSum.push(current[type]);
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
		typeToSelect,
		input,
		labels,
		types,
		colors,
	}: {
		typeToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		types: string[];
		colors: string[];
	}): IDataset => {
		const nonEmptyLabels: string[] = [];
		const usableColors = [...colors];
		const datasets = types.map((type) => {
			const color = usableColors[0];
			usableColors.shift();
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
				data: labels
					.map((label: string) => {
						const typesFound = input[label]
							.filter((i: IInput) =>
								typeToSelect.includes(i.type)
							)
							.reduce(
								(
									types: { [key: string]: number },
									current: IInput
								) => {
									if (!types[current.id])
										types[current.id] = 0;
									types[current.id] = current.value;
									return types;
								},
								{}
							);
						if (
							Object.keys(typesFound).length > 0 &&
							!nonEmptyLabels.includes(label)
						)
							nonEmptyLabels.push(label);

						return typesFound;
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
						if (current[type]) typeSum.push(current[type]);
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
		typeToSelect,
		input,
		labels,
		colors,
	}: {
		typeToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		colors: string[];
	}): IDataset => {
		const usableColors = [...colors];
		const datasets = typeToSelect.map((type) => {
			const color = usableColors[0];
			usableColors.shift();
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

	getLastValuePerTypeForCurrentMonth: ({
		typeToSelect,
		input,
		date = undefined,
	}: {
		typeToSelect: string[];
		input: { [key: string]: IInput[] };
		date: string | undefined;
	}): IReportData => {
		// TODO: at some point this Date must be configurable.
		let d = new Date();
		if (date) d = new Date(date);

		// Select current month dataset
		const lastInput = input[`${d.getUTCFullYear()}-${getMonth(d)}`];
		// TECH. DEBT !
		// Keeping only last reference for a month.
		// When this is : Portfolio type.
		const _lastInput: IInput[] = [];
		lastInput.reverse().forEach((li) => {
			if (li.type !== "Portfolio") _lastInput.push(li);
			if (_lastInput.every((_li) => _li.id !== li.id))
				_lastInput.push(li);
		});

		const datasets = typeToSelect.map((type) => {
			// Get Last item from our input array
			return {
				label: type,
				// Get the sum of all data for the specified type
				data: _lastInput
					.filter((entry) => entry.type === type)
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
		typeToSelect,
		input,
		labels,
		types,
		colors,
	}: {
		typeToSelect: string[];
		input: { [key: string]: IInput[] };
		labels: string[];
		types: string[];
		colors: string[];
	}): IDataset => {
		const usableColors = [...colors];
		const datasets = types.map((type) => {
			const color = usableColors[0];
			usableColors.shift();

			console.debug(labels);

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
				data: labels
					.map((label: string) => {
						return input[label]
							.filter((i: IInput) =>
								typeToSelect.includes(i.type)
							)
							.reduce(
								(
									types: { [key: string]: number },
									current: IInput
								) => {
									if (!types[current.id])
										types[current.id] = 0;
									types[current.id] += current.value;
									return types;
								},
								{}
							);
					})
					.reduce((typeSum, current) => {
						if (current[type]) typeSum.push(current[type]);
						else typeSum.push(0);
						return typeSum;
					}, [])
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
};
