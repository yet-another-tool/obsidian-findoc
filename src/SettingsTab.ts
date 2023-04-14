import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import FinDocPlugin from "main";
import { debounce } from "utils";

export default class SettingsTab extends PluginSettingTab {
	plugin: FinDocPlugin;

	constructor(app: App, plugin: FinDocPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings" });

		new Setting(containerEl).setName("Support").addButton((button) => {
			button.buttonEl.innerHTML =
				"<a style='margin: 0 auto;' href='https://www.buymeacoffee.com/studiowebux'><img width='109px' alt='Buy me a Coffee' src='https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png'/></a>";
			button.buttonEl.style.boxShadow = "none";
			button.buttonEl.style.backgroundColor = "transparent";
		});

		new Setting(containerEl)
			.setName("CSV Save debounce")
			.setDesc("Timeout to trigger the CSV saving process")
			.addText((text) => {
				text.setValue(this.plugin.settings.debounce.toString());
				text.onChange(
					debounce(async (value: string) => {
						this.plugin.settings.debounce = value;
						await this.plugin.saveSettings();
						new Notice("Debounce Updated !");
					}, 500)
				);
			});

		new Setting(containerEl).setName("CSV Separator").addText((text) => {
			text.setValue(this.plugin.settings.csvSeparator.toString());
			text.onChange(
				debounce(async (value: string) => {
					this.plugin.settings.csvSeparator = value;
					await this.plugin.saveSettings();
					new Notice("CSV Separator Updated !");
				}, 500)
			);
		});

		new Setting(containerEl)
			.setName("Models")
			.setDesc("Models available (It must be a JSON.stringify version)");
		const div = containerEl.createDiv();
		div.style.border = "2px solid grey";
		div.style.borderRadius = "5px";
		div.style.padding = "10px";

		Object.entries(this.plugin.settings.models).forEach(([key, model]) => {
			const modelSection = div.createDiv();
			const el = modelSection.createEl("h2");
			el.innerText = key;
			modelSection.style.padding = "10px";
			modelSection.style.marginBottom = "20px";
			new Setting(modelSection)
				.setName(`Data Source for ${key}`)
				.addDropdown((dropdown) => {
					dropdown.setValue(
						this.plugin.settings.models[key].dataSource
					);
					dropdown.addOption(
						"splitDailyDates",
						"Split By Daily Dates"
					);
					dropdown.addOption(
						"splitByYearMonth",
						"Split By Year & Month"
					);
					dropdown.addOption("splitByYear", "Split By Year");

					dropdown.onChange(async (value) => {
						this.plugin.settings.models[key].dataSource = value;
						await this.plugin.saveSettings();
						new Notice("Data Source Updated !");
					});
				});
			new Setting(modelSection)
				.setName(`Output Function for ${key}`)
				.addDropdown((dropdown) => {
					dropdown.setValue(this.plugin.settings.models[key].output);
					dropdown.addOption(
						"generateSumDataSet",
						"Generate Sum Dataset"
					);
					dropdown.addOption(
						"generateDailyDataSet",
						"Generate Daily Dataset"
					);

					dropdown.onChange(async (value) => {
						this.plugin.settings.models[key].output = value;
						await this.plugin.saveSettings();
						new Notice("Output Updated !");
					});
				});

			new Setting(modelSection)
				.setName(`Begin at Zero for ${key}`)
				.addToggle((toggle) => {
					toggle.setValue(
						this.plugin.settings.models[key].beginAtZero
					);
					toggle.onChange(async (value) => {
						this.plugin.settings.models[key].beginAtZero = value;
						await this.plugin.saveSettings();
						new Notice("Begin at Zero Updated !");
					});
				});

			new Setting(modelSection)
				.setName(`Categories for ${key}`)
				.setDesc("WIP: need a multi select.")
				.addTextArea((textArea) => {
					textArea.inputEl.rows = 3;
					textArea.inputEl.cols = 40;
					textArea.setValue(JSON.stringify(model.categories));
					textArea.onChange(
						debounce(async (value: string) => {
							try {
								if (
									!value ||
									typeof value !== "string" ||
									JSON.parse(value) === null
								)
									return;
								this.plugin.settings.models[key].categories =
									typeof value === "string"
										? JSON.parse(value)
										: value;
								await this.plugin.saveSettings();
								new Notice("Categories Updated !");
							} catch (e) {
								console.error(e.message);
								return;
							}
						}, 300)
					);
				});

			modelSection.createEl("hr");
		});

		new Setting(containerEl).setName("Colors");
		const colorSection = containerEl.createDiv();
		colorSection.style.padding = "10px";

		this.plugin.settings.colors.forEach((color, key) => {
			new Setting(colorSection)
				.setName(`Color #${key}`)
				.addColorPicker(async (colorPicker) => {
					colorPicker.setValue(color);
					colorPicker.onChange(
						debounce(async (value: string) => {
							this.plugin.settings.colors[key] = value;
							await this.plugin.saveSettings();
							new Notice("Color Updated !");
						}, 500)
					);
				});
		});
	}
}
