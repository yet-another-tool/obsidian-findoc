import { MarkdownRenderChild } from "obsidian";
import Chart, { ChartConfiguration } from "chart.js/auto";

export default class ChartRenderer extends MarkdownRenderChild {
	private data: IChartLine;
	private modelInfo: IModel;
	private model: string;
	private canvases: { [key: string]: HTMLCanvasElement } = {};

	constructor(
		modelInfo: IModel,
		data: IChartLine,
		model: string,
		el: HTMLElement
	) {
		super(el);
		this.modelInfo = modelInfo;
		this.data = data;
		this.model = model;
	}

	async onload() {
		if (!this.canvases[this.model]) {
			this.canvases[this.model] = document.createElement("canvas");

			// Chart
			new Chart(
				this.canvases[this.model].getContext("2d"),
				this.data as ChartConfiguration
			);
			this.containerEl.createEl("h3", { text: this.model });

			this.containerEl.append(this.canvases[this.model]);
			this.containerEl.createEl("p", {
				text: `Data Source: ${this.modelInfo.dataSource}`,
			});
			this.containerEl.createEl("p", {
				text: `Output: ${this.modelInfo.output}`,
			});
		} else {
			console.debug("Canvas already loaded");
		}
	}
}
