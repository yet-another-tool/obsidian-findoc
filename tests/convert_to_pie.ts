// npx tsx tests/convert_to_pie.ts

const source = {
	labels: ["2024-01", "2024-02"],
	datasets: [
		{
			label: "Food",
			borderColor: "#1ac18f",
			fill: false,
			tension: 0.2,
			spanGaps: true,
			segment: {},
			data: [350, 350],
		},
		{
			label: "Entertainment",
			borderColor: "#EAE2B7",
			fill: false,
			tension: 0.2,
			spanGaps: true,
			segment: {},
			data: [30, 30],
		},
		{
			label: "Electricity",
			borderColor: "#8ecae6",
			fill: false,
			tension: 0.2,
			spanGaps: true,
			segment: {},
			data: [200, 200],
		},
		{
			label: "Telecom",
			borderColor: "#219ebc",
			fill: false,
			tension: 0.2,
			spanGaps: true,
			segment: {},
			data: [0, 100],
		},
	],
};

console.log(source);

const output: any = { labels: [], datasets: [] };

source.datasets.forEach((dataset) => {
	output.labels.push(dataset.label); // categories
});

source.labels.forEach((label, idx) => {
	// years
	output.datasets.push({
		label,
		data: source.datasets.map((dataset) => dataset.data[idx]),
	});
});

console.log(JSON.stringify(output));

export {}