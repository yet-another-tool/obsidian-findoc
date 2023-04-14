import {
	MarkdownPostProcessorContext,
	Plugin,
	WorkspaceLeaf,
	parseYaml,
} from "obsidian";
import path from "path";

import { CSVView, VIEW_TYPE_CSV } from "./view";
import processing from "./processing";
import { DEFAULT_SETTINGS } from "./defaults";
import SettingsTab from "./SettingsTab";
import ChartRenderer from "./ChartRenderer";

export default class FinDocPlugin extends Plugin {
	settings: IPluginSettings;

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this));

		const { vault } = this.app;

		this.registerView(
			VIEW_TYPE_CSV,
			(leaf: WorkspaceLeaf) => new CSVView(leaf, this)
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
					const chartData = processing(
						data,
						content.model,
						this.settings.models,
						this.settings.csvSeparator
					);

					ctx.addChild(
						new ChartRenderer(chartData, content.model, el)
					);
				}
			}
		);
	}
}
