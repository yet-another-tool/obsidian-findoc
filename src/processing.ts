import { chartLine } from "chart";
import { resetColors } from "colors";
import { getData } from "csv";
import { functions } from "methods";

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
	separator = ","
) {
	// Put back all colors in the array
	resetColors();
	const json = getData(csvRawData, separator);
	const model = models[modelToGenerate];

	const labels = Object.keys(functions[model.dataSource](json));
	const categories = getCategories(model.categories, json);
	const output: IDataset = functions[model.output](
		model.categories,
		functions[model.dataSource](json),
		labels,
		categories
	);

	return chartLine(output, model.type, model.beginAtZero);
}

export default processing;
