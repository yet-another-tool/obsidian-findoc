import { MarkdownRenderChild } from "obsidian";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { idToText } from "utils";

export default class ChartRenderer extends MarkdownRenderChild {
	private data: IChartLine;
	private modelInfo: IModel;
	private model: string;
	private title: string;
	private filenames: string[];
	private canvases: { [key: string]: HTMLCanvasElement } = {};

	constructor(
		modelInfo: IModel,
		data: IChartLine,
		model: string,
		title: string,
		filenames: string[],
		el: HTMLElement
	) {
		super(el);
		this.modelInfo = modelInfo;
		this.data = data;
		this.title = title; // Chart Title
		this.filenames = filenames;
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
			// TODO: Collapse Footer with a button
			const containerInfo = this.containerEl.createEl("div");
			containerInfo.createEl("p", {
				text: `Data Source: ${idToText(this.modelInfo.dataSource)}`,
			});
			containerInfo.createEl("p", {
				text: `Model: ${this.model}`,
			});
			containerInfo.createEl("p", {
				text: `Output: ${idToText(this.modelInfo.output)}`,
			});
			containerInfo.createEl("p", {
				text: `Source Input(s): ${this.filenames.join(", ")}`,
			});
		} else {
			console.debug("Canvas already loaded");
		}
	}
}
