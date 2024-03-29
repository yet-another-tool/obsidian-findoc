import { chartLine, chartPie, chartRadar } from "chart";
import { getData } from "csv";
import { convert_to_pie_chart, convert_to_radar_chart } from "data_conversion";
import { functions, splitBy } from "methods";
import { IInput, IModel, IDataset } from "types";

export function getCategories(
	categoriesToSelect: string[],
	input: Array<IInput>
) {
	return Object.values(input)
		.filter((line) => categoriesToSelect.includes(line.category))
		.reduce((categories, current) => {
			if (!categories.includes(current.subcategory))
				categories.push(current.subcategory);
			return categories;
		}, []);
}

function processing(
	csvRawData: string,
	modelToGenerate: string,
	models: {
		[key: string]: IModel;
	},
	colors: string[],
	chartType: "line" | "pie" | "radar" = "line",
	separator = ","
) {
	// Convert the RAW CSV DATA to JSON format
	const json: IInput[] = getData(csvRawData, separator);
	// Get the model definition (can be change in the defaults.ts or in the settings)
	const model: IModel = models[modelToGenerate];

	if (!model || !splitBy[model.dataSource] || !functions[model.output])
		throw new Error(
			`The specified model : "${modelToGenerate}" does not exist or the split function "${model.dataSource}" does not exist. Model names are available in the Documentation.`
		);

	// Extract the keys generated by the split function, defined in the model and it requires the JSON format data.
	const labels = Object.keys(
		splitBy[model.dataSource].exec(json, model.dataSourceKey)
	).map((label) => (label && label !== "" ? label : "_NO_LABEL_"));

	// For each entry, we keep only the one required by the model. It is filtered by the category.
	const categories = getCategories(model.categories, json);
	// Generator function
	const output: IDataset = functions[model.output].exec({
		categoriesToSelect: model.categories,
		input: splitBy[model.dataSource].exec(json, model.dataSourceKey),
		labels,
		categories,
		colors,
		values: model.values ? model.values.split(",") : [],
	}) as IDataset;

	if (chartType === "line") {
		return chartLine(
			output,
			model.chartLabelType,
			model.suffix,
			model.beginAtZero
		);
	} else if (chartType === "pie") {
		return chartPie(convert_to_pie_chart(output));
	} else if (chartType === "radar") {
		return chartRadar(convert_to_radar_chart(output));
	}
}

export default processing;
