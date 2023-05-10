import { chartLine } from "chart";
import { getData } from "csv";
import { functions } from "methods";

function getTypes(typesToSelect: string[], input: Array<IInput>) {
	return Object.values(input)
		.filter((line) => typesToSelect.includes(line.type))
		.reduce((types, current) => {
			if (!types.includes(current.id)) types.push(current.id);
			return types;
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
	const json = getData(csvRawData, separator);
	const model = models[modelToGenerate];

	const labels = Object.keys(functions[model.dataSource](json));
	const types = getTypes(model.types, json);
	const output: IDataset = functions[model.output]({
		typeToSelect: model.types,
		input: functions[model.dataSource](json),
		labels,
		types,
		colors,
	});

	return chartLine(output, model.type, model.beginAtZero);
}

export default processing;
