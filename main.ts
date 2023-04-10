import {
	MarkdownPostProcessorContext,
	MarkdownRenderChild,
	Plugin,
	WorkspaceLeaf,
	parseYaml,
} from "obsidian";
import Chart from "chart.js/auto";

import { CSVView, VIEW_TYPE_CSV } from "./view";
import path from "path";
import processing from "processing";

export default class FinDocPlugin extends Plugin {
	async onload() {
		const { vault } = this.app;

		this.registerView(
			VIEW_TYPE_CSV,
			(leaf: WorkspaceLeaf) => new CSVView(leaf)
		);

		this.registerExtensions(["csv"], VIEW_TYPE_CSV);

		this.registerMarkdownCodeBlockProcessor(
			"findoc",
			async (
				src: string,
				el: HTMLElement,
				ctx: MarkdownPostProcessorContext
			) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (!activeFile) {
					return;
				}
				const content = parseYaml(src);
				if (!content || !content.filename) {
					return;
				}

				if (content.filename) {
					const data = await vault.adapter.read(
						path.join(activeFile.parent.path, content.filename)
					);
					const chartData = processing(data, content.model);

					ctx.addChild(
						new ChartRendered(chartData, content.model, el)
					);
				}
			}
		);
	}
}

class ChartRendered extends MarkdownRenderChild {
	private data: any;
	private model: string;
	private canvases: { [key: string]: any } = {};

	constructor(data: any, model: string, el: HTMLElement) {
		super(el);
		this.data = data;
		this.model = model;
	}

	async onload() {
		if (!this.canvases[this.model]) {
			this.canvases[this.model] = document.createElement("canvas");

			// Chart
			new Chart(this.canvases[this.model].getContext("2d"), this.data);
			this.containerEl.append(
				(document.createElement("h3").innerText = this.model)
			);
			this.containerEl.append(this.canvases[this.model]);
		}
	}
}
