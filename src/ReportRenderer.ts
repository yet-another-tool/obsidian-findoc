import { MarkdownRenderChild } from "obsidian";
import { idToText } from "utils";

export default class ReportRenderer extends MarkdownRenderChild {
	private data: IReportData;
	private modelInfo: IModel;

	constructor(modelInfo: IModel, data: IReportData, el: HTMLElement) {
		super(el);
		this.modelInfo = modelInfo;
		this.data = data;
	}

	async onload() {
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
			const type = this.containerEl.createEl("div");

			type.createEl("span", {
				text: `${entry.label}: ${entry.data.toLocaleString("en-US", {
					style: "currency",
					currency: "USD",
				})}`,
			});
		});
	}
}
