import { IDataset, IPieDataset, IRadarDataset } from "types";

export function convert_to_pie_chart(source: IDataset): IPieDataset {
	const output: IPieDataset = { labels: [], datasets: [] };

	source.datasets.forEach((dataset) => {
		output.labels.push(dataset.label);
	});

	source.labels.forEach((label, idx) => {
		output.datasets.push({
			label,
			data: source.datasets.map((dataset) => dataset.data[idx]),
		});
	});

	return output;
}

export function convert_to_radar_chart(source: IDataset): IRadarDataset {
	const output: IRadarDataset = { labels: [], datasets: [] };

	source.datasets.forEach((dataset) => {
		output.labels.push(dataset.label);
	});

	source.labels.forEach((label, idx) => {
		output.datasets.push({
			label,
			data: source.datasets.map((dataset) => dataset.data[idx]),
			fill: true,
		});
	});

	return output;
}
