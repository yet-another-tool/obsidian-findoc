import { MarkdownRenderChild } from "obsidian";
import {
	IReportData,
	IModel,
	IReportEntry,
	IReportMultiData,
	IReportEntries,
} from "types";
import { idToText } from "utils";

export default class ReportRenderer extends MarkdownRenderChild {
	private data: IReportData | IReportMultiData;
	private modelInfo: IModel;

	constructor(
		modelInfo: IModel,
		data: IReportData | IReportMultiData,
		el: HTMLElement
	) {
		super(el);
		this.modelInfo = modelInfo;
		this.data = data;
	}

	async onload() {
		// TODO: The report must be completely reworked to support better implementation and configurations.
		if (Array.isArray(this.data.datasets)) {
			this.containerEl.createEl("h3", {
				text: `Report ${this.data?.datasets[0]?.date}`,
			});

			this.containerEl.createEl("p", {
				text: `Data Source: ${idToText(this.modelInfo.dataSource)}`,
			});
			this.containerEl.createEl("p", {
				text: `Output: ${idToText(this.modelInfo.output)}`,
			});

			this.containerEl.createEl("hr");

			this.data.datasets.forEach((entry: IReportEntry) => {
				const chartLabelType = this.containerEl.createEl("div");

				// TODO: implement chart label types as well.
				chartLabelType.createEl("span", {
					text: `${entry.label}: ${entry.data.toLocaleString(
						"en-US",
						{
							style: "currency",
							currency: "USD",
						}
					)}`,
				});
			});
		} else if (!Array.isArray(this.data.datasets)) {
			const { data, label, labels } = this.data
				.datasets as IReportEntries;
			this.containerEl.createEl("h3", {
				text: `Report ${label}`,
			});

			this.containerEl.createEl("p", {
				text: `Data Source: ${idToText(this.modelInfo.dataSource)}`,
			});
			this.containerEl.createEl("p", {
				text: `Output: ${idToText(this.modelInfo.output)}`,
			});

			this.containerEl.createEl("hr");
			labels.forEach((dataLabel, idx) => {
				const chartLabelType = this.containerEl.createEl("div");

				// TODO: implement chart label types as well.
				chartLabelType.createEl("span", {
					text: `${dataLabel}: ${data[idx].toLocaleString("en-US", {
						style: "currency",
						currency: "USD",
					})}`,
				});
			});
		}
	}
}
