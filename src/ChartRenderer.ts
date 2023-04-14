import { MarkdownRenderChild } from "obsidian";
import Chart, { ChartConfiguration } from "chart.js/auto";

export default class ChartRenderer extends MarkdownRenderChild {
	private data: IChartLine;
	private model: string;
	private canvases: { [key: string]: HTMLCanvasElement } = {};

	constructor(data: IChartLine, model: string, el: HTMLElement) {
		super(el);
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
			this.containerEl.append(
				(document.createElement("h3").innerText = this.model)
			);
			this.containerEl.append(this.canvases[this.model]);
		} else {
			console.debug("Canvas already loaded");
		}
	}
}
