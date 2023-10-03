import { chartLine } from "chart";
import { getData } from "csv";
import { functions } from "methods";
import { IInput, IModel, IDataset } from "types";

function getCategories(categoriesToSelect: string[], input: Array<IInput>) {
	return Object.values(input)
		.filter((line) => categoriesToSelect.includes(line.type))
		.reduce((categories, current) => {
			if (!categories.includes(current.id)) categories.push(current.id);
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
	separator = ","
) {
	const json: IInput[] = getData(csvRawData, separator);
	const model: IModel = models[modelToGenerate];

	const labels = Object.keys(functions[model.dataSource](json));
	const categories = getCategories(model.categories, json);
	const output: IDataset = functions[model.output]({
		typeToSelect: model.categories,
		input: functions[model.dataSource](json),
		labels,
		categories,
		colors,
	});

	return chartLine(
		output,
		model.chartLabelType,
		model.suffix,
		model.beginAtZero
	);
}

export default processing;
