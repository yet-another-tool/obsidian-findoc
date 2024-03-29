import {
	MarkdownPostProcessorContext,
	Menu,
	MenuItem,
	Notice,
	Plugin,
	TFile,
	WorkspaceLeaf,
	normalizePath,
	parseYaml,
} from "obsidian";

import { CSVView, VIEW_TYPE_CSV } from "./view";
import processing from "./processing";
import { DEFAULT_SETTINGS, HEADER } from "./defaults";
import SettingsTab from "./SettingsTab";
import ChartRenderer from "./ChartRenderer";
import ReportRenderer from "ReportRenderer";
import reporting from "reporting";
import { loadCSVData } from "data";
import { IPluginSettings, IReportData } from "types";

export default class FinDocPlugin extends Plugin {
	settings: IPluginSettings;

	async createCSVFile(parent = "") {
		const filename = normalizePath(
			`/${parent}/findoc_${new Date()
				.toISOString()
				.replace(/[:|.]/g, "_")}.csv`
		);
		const exists = await this.app.vault.adapter.exists(filename, true);

		if (exists) {
			new Notice("File already exist.");
		} else {
			await this.app.vault.create(filename, HEADER);
		}
	}

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

						const filenames: string[] = content.filename
							.split(",")
							.map((filename: string) =>
								normalizePath(
									`${
										activeFile.parent.path
									}/${filename.trim()}`
								)
							);

						if (filenames && filenames.length > 0) {
							const data = await loadCSVData(vault, filenames);

							if (
								content.view === "view" ||
								content.view === "line" ||
								content.type === "chart" || // DEPRECATED
								content.type === "line" || // DEPRECATED
								(!content.type && !content.view)
							) {
								try {
									const chartData = processing(
										data,
										content.model,
										this.settings.models,
										this.settings.colors,
										"line",
										this.settings.csvSeparator
									);
									if (chartData)
										ctx.addChild(
											new ChartRenderer(
												this.settings.models[
													content.model
												],
												chartData,
												content.model,
												content.title,
												filenames,
												el
											)
										);
								} catch (e) {
									new Notice(
										`An error occured while processing ${content.model}, ${content.title}`,
										30000
									);
									throw e;
								}
							} else if (
								content.type === "report" || // DEPRECATED
								content.view === "report"
							) {
								const reportData: IReportData = reporting(
									data,
									content.model,
									content.date || undefined,
									this.settings.models,
									this.settings.csvSeparator
								);
								ctx.addChild(
									new ReportRenderer(
										this.settings.models[content.model],
										reportData,
										el
									)
								);
							} else if (
								content.view === "pie" ||
								content.type === "pie"
							) {
								try {
									const chartData = processing(
										data,
										content.model,
										this.settings.models,
										this.settings.colors,
										"pie",
										this.settings.csvSeparator
									);
									if (chartData)
										ctx.addChild(
											new ChartRenderer(
												this.settings.models[
													content.model
												],
												chartData,
												content.model,
												content.title,
												filenames,
												el
											)
										);
								} catch (e) {
									new Notice(
										`An error occured while processing ${content.model}, ${content.title}`,
										30000
									);
									throw e;
								}
							} else if (
								content.view === "radar" ||
								content.type === "radar"
							) {
								try {
									const chartData = processing(
										data,
										content.model,
										this.settings.models,
										this.settings.colors,
										"radar",
										this.settings.csvSeparator
									);
									if (chartData)
										ctx.addChild(
											new ChartRenderer(
												this.settings.models[
													content.model
												],
												chartData,
												content.model,
												content.title,
												filenames,
												el
											)
										);
								} catch (e) {
									new Notice(
										`An error occured while processing ${content.model}, ${content.title}`,
										30000
									);
									throw e;
								}
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

			this.addRibbonIcon("table", "Create CSV File", async (e) => {
				this.createCSVFile();
			});
			const menuCreateCSVFile = (menu: Menu, file: TFile) => {
				menu.addItem((item: MenuItem) => {
					item.setTitle("Create CSV File").onClick(() => {
						this.createCSVFile(file.path);
					});
				});
			};

			this.registerEvent(
				this.app.workspace.on("file-menu", menuCreateCSVFile)
			);
		} catch (e) {
			new Notice(e.message, 10000);
			throw e;
		}
	}
}
