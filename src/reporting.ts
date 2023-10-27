import { getData } from "csv";
import { functions } from "methods";
import { IModel, IReportData } from "types";

function reporting(
	csvRawData: string,
	modelToGenerate: string,
	date: string | undefined,
	models: {
		[key: string]: IModel;
	},
	separator = ","
): IReportData {
	const json = getData(csvRawData, separator);
	const model = models[modelToGenerate];

	if (!model || !functions[model.dataSource])
		throw new Error(
			`The specified model : "${modelToGenerate}" does not exists. Model names are available in the Documentation.`
		);

	const output: IReportData = functions[model.output]({
		categoriesToSelect: model.categories,
		input: functions[model.dataSource](json, model.dataSourceKey),
		date,
	});

	return output;
}
export default reporting;
