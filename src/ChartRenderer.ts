import { MarkdownRenderChild } from "obsidian";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { idToText } from "utils";

export default class ChartRenderer extends MarkdownRenderChild {
	private data: IChartLine;
	private modelInfo: IModel;
	private model: string;
	private title: string;
	private canvases: { [key: string]: HTMLCanvasElement } = {};

	constructor(
		modelInfo: IModel,
		data: IChartLine,
		model: string,
		title: string,
		el: HTMLElement
	) {
		super(el);
		this.modelInfo = modelInfo;
		this.data = data;
		this.title = title; // Chart Title
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

			// Header
			if (this.title && this.title !== "") {
				this.containerEl.createEl("h3", { text: this.title });
			} else {
				this.containerEl.createEl("h3", { text: this.model });
			}

			// Chart
			this.containerEl.append(this.canvases[this.model]);

			// Footer
			this.containerEl.createEl("p", {
				text: `Data Source: ${idToText(this.modelInfo.dataSource)}`,
			});
			this.containerEl.createEl("p", {
				text: `Model: ${this.model}`,
			});
			this.containerEl.createEl("p", {
				text: `Output: ${idToText(this.modelInfo.output)}`,
			});
			this.containerEl.createEl("p", {
				text: `Found: ${this.data.data.datasets.reduce(
					(a, b) => (a += b.data.length),
					0
				)} data point(s)`,
			});
		} else {
			console.debug("Canvas already loaded");
		}
	}
}
