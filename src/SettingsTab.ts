import { App, Notice, PluginSettingTab, Setting, debounce } from "obsidian";
import FinDocPlugin from "main";
import { idToText } from "utils";
import loadIcons from "loadIcons";
import { types } from "./constants";

export default class SettingsTab extends PluginSettingTab {
	plugin: FinDocPlugin;

	constructor(app: App, plugin: FinDocPlugin) {
		super(app, plugin);
		this.plugin = plugin;

		loadIcons();
	}

	createNewColorBtn(): HTMLElement {
		const btn = this.containerEl.createEl("button");
		btn.classList.add("findoc-btn-margin-bottom");
		btn.id = "newColor";
		btn.innerText = "Add New Color";
		btn.onClickEvent(() => {
			this.plugin.settings.colors.unshift("#ffffff");
			console.debug(this.plugin.settings.colors);
			this.display();
		});
		return btn;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings" });

		new Setting(containerEl).setName("Support").addButton((button) => {
			button.buttonEl.innerHTML =
				"<a style='margin: 0 auto;' href='https://www.buymeacoffee.com/studiowebux'><img width='109px' alt='Buy me a Coffee' src='https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png'/></a>";
			button.buttonEl.classList.add("findoc-support-btn");
		});

		new Setting(containerEl)
			.setName("CSV Save debounce")
			.setDesc(
				"Timeout to trigger the CSV saving process (Value must be greater than 500 and less than 5000)"
			)
			.addText((text) => {
				text.setValue(this.plugin.settings.debounce.toString());
				text.onChange(
					debounce(async (value: string) => {
						if (
							isNaN(parseInt(value)) ||
							parseInt(value) < 500 ||
							parseInt(value) > 5000
						) {
							new Notice("Invalid debounce value !");
							return;
						}
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
		div.classList.add("findoc-models-container");

		Object.entries(this.plugin.settings.models).forEach(([key, model]) => {
			const name = idToText(key);
			const modelSection = div.createDiv();
			const el = modelSection.createEl("h2");
			el.innerText = name;
			modelSection.classList.add("findoc-model-section");

			new Setting(modelSection)
				.setName(`Data Source for ${name}`)
				.addDropdown((dropdown) => {
					dropdown.addOption(
						"splitDailyDates",
						"Split By Daily Dates"
					);
					dropdown.addOption(
						"splitByYearMonth",
						"Split By Year & Month"
					);
					dropdown.addOption("splitByYear", "Split By Year");
					dropdown.setValue(
						this.plugin.settings.models[key].dataSource
					);

					dropdown.onChange(async (value) => {
						this.plugin.settings.models[key].dataSource = value;
						await this.plugin.saveSettings();
						new Notice("Data Source Updated !");
					});
				});
			new Setting(modelSection)
				.setName(`Output Function for ${name}`)
				.addDropdown((dropdown) => {
					dropdown.addOption(
						"generateSumDataSet",
						"Generate Sum Dataset"
					);
					dropdown.addOption(
						"generateDailyDataSet",
						"Generate Daily Dataset"
					);
					dropdown.addOption(
						"generateSumDataSetPerTypes",
						"Generate Sum Dataset Per Types"
					);

					dropdown.addOption(
						"getLastValuePerTypeForCurrentMonth",
						"Get Last Value Per Type For Current Month"
					);
					dropdown.setValue(this.plugin.settings.models[key].output);

					dropdown.onChange(async (value) => {
						this.plugin.settings.models[key].output = value;
						await this.plugin.saveSettings();
						new Notice("Output Updated !");
					});
				});

			new Setting(modelSection)
				.setName(`Begin at Zero for ${name}`)
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

			const h2 = modelSection.createEl("h2");
			h2.innerText = `Types for ${name}`;

			const wrapper = modelSection.createDiv();
			wrapper.classList.add("findoc-model-section-wrapper");

			const select = wrapper.createEl("select");
			select.id = key;
			select.multiple = true;
			select.classList.add("findoc-select");

			select.setAttribute("value", model.types.join(","));

			select.onchange = async () => {
				const selected = [];
				// @ts-ignore
				for (const option of document.getElementById(key).options) {
					if (option.selected) {
						selected.push(option.value);
					}
				}
				// select.value = selected.join(",");
				model.types = selected;
				await this.plugin.saveSettings();
				new Notice("Types Updated !");
			};

			types.forEach((type: string) => {
				const opt = select.createEl("option");
				opt.id = type;
				opt.value = type;
				opt.innerText = type;
				opt.selected = model.types.includes(type);
			});

			modelSection.createEl("hr");
		});

		new Setting(containerEl).setName("Colors");
		const colorSection = containerEl.createDiv();
		colorSection.appendChild(this.createNewColorBtn());
		colorSection.classList.add("findoc-color-section");

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
				})
				.addExtraButton((btn) => {
					btn.setTooltip("Delete Color");
					btn.setIcon("trash");
					btn.onClick(async () => {
						this.plugin.settings.colors.splice(key, 1);
						await this.plugin.saveSettings();
						new Notice("Color Deleted !");
						this.display();
					});
				});
		});
	}
}
