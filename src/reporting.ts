import { getData } from "csv";
import { functions, splitBy } from "methods";
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

	if (!model || !splitBy[model.dataSource] || !functions[model.output])
		throw new Error(
			`The specified model : "${modelToGenerate}" does not exist or the split function "${model.dataSource}" does not exist. Model names are available in the Documentation.`
		);

	const output: IReportData = functions[model.output].exec({
		categoriesToSelect: model.categories,
		input: splitBy[model.dataSource].exec(json, model.dataSourceKey),
		date,
		values: model.values ? model.values.split(",") : [],
	}) as IReportData;

	return output;
}
export default reporting;
