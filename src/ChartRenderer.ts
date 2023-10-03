import { MarkdownRenderChild } from "obsidian";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { idToText } from "utils";
import { IChartLine, IModel } from "types";

const generateId = () => {
	const array = new Uint32Array(10);
	return `id-${window.crypto.getRandomValues(array)[0].toString()}`;
};

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
			/// Button to toggle footer
			const id = generateId();
			const btn = this.containerEl.createEl("button");
			btn.addClasses(["findoc-btn"]);
			btn.setAttribute("data-toggle", "collapse");
			btn.setAttribute("data-target", `.collapse.${id}`);
			btn.setAttribute("data-text", "Collapse");
			btn.textContent = "Toggle Chart Information";
			btn.onclick = (ev: MouseEvent) => {
				const containers = Array.from(
					document.querySelectorAll(btn.getAttribute("data-target"))
				);
				containers.forEach((target) => {
					target.classList.toggle("show");
				});
			};

			/// Footer content
			const containerInfo = this.containerEl.createEl("div");
			containerInfo.addClasses(["collapse", id]);

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
