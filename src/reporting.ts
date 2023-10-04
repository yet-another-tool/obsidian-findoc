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

	const output: IReportData = functions[model.output]({
		categoriesToSelect: model.categories,
		input: functions[model.dataSource](json),
		date,
	});

	return output;
}
export default reporting;
