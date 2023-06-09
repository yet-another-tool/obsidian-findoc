import {
	MarkdownPostProcessorContext,
	Notice,
	Plugin,
	WorkspaceLeaf,
	normalizePath,
	parseYaml,
} from "obsidian";

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
		try {
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
					try {
						const activeFile = this.app.workspace.getActiveFile();
						if (!activeFile) {
							return;
						}
						const content = parseYaml(src);
						if (!content || !content.filename) {
							new Notice("No Content or No Filename", 10000);
							return;
						}

						if (content.filename) {
							const filename = normalizePath(
								`${activeFile.parent.path}/${content.filename}`
							);

							const data = await vault.adapter.read(filename);
							const chartData = processing(
								data,
								content.model,
								this.settings.models,
								this.settings.colors,
								this.settings.csvSeparator
							);

							if (chartData) {
								ctx.addChild(
									new ChartRenderer(
										this.settings.models[content.model],
										chartData,
										content.model,
										el
									)
								);
							} else {
								new Notice("Unable to generate chart", 10000);
							}
						}
					} catch (e) {
						new Notice(e.message, 10000);
						throw e;
					}
				}
			);
		} catch (e) {
			new Notice(e.message, 10000);
			throw e;
		}
	}
}
