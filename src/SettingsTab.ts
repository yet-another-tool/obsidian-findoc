import { App, Notice, PluginSettingTab, Setting, debounce } from "obsidian";
import FinDocPlugin from "main";
import { idToText } from "utils";
import loadIcons from "loadIcons";
import { IDataSourceKeys } from "types";

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
			this.display();
		});
		return btn;
	}

	createNewCategoryBtn(): HTMLElement {
		const btn = this.containerEl.createEl("button");
		btn.classList.add("findoc-btn-margin-bottom");
		btn.id = "newType";
		btn.innerText = "Add New Category";
		btn.onClickEvent(() => {
			this.plugin.settings.categories.unshift("");
			this.display();
		});
		return btn;
	}

	getCategories() {
		return this.plugin.settings.categories;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings" });

		//
		// SUPPORT
		//

		new Setting(containerEl).setName("Support").addButton((button) => {
			button.buttonEl.innerHTML =
				"<a style='margin: 0 auto;' href='https://www.buymeacoffee.com/studiowebux'><img width='109px' alt='Buy me a Coffee' src='https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png'/></a>";
			button.buttonEl.classList.add("findoc-support-btn");
		});

		//
		// DOCUMENTATION
		//

		new Setting(containerEl)
			.setName("Documentation")
			.addButton((button) => {
				button.buttonEl.innerHTML =
					"<a style='margin: 0 auto;' href='https://studiowebux.github.io/obsidian-plugins-docs/docs/category/plugin-financial-doc/'>Link to Documentation</a>";
				button.buttonEl.classList.add("findoc-documentation-btn");
			});

		//
		// CSV SAVE DEBOUNCE
		//

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

		//
		// CSV SEPARATOR
		//

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

		//
		// USE LAST ELEMENT AS TEMPLATE
		//

		new Setting(containerEl)
			.setName("Use Last Element as Template")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.useLastElementAsTemplate);
				toggle.onChange(
					debounce(async (value: boolean) => {
						this.plugin.settings.useLastElementAsTemplate = value;
						await this.plugin.saveSettings();
						new Notice("Use Last Element as Template Updated !");
					}, 500)
				);
			});

		//
		// TOGGLE AUTOCOMPLETE
		//

		new Setting(containerEl)
			.setName("Use Autocomplete")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.useAutocomplete);
				toggle.onChange(
					debounce(async (value: boolean) => {
						this.plugin.settings.useAutocomplete = value;
						await this.plugin.saveSettings();
						new Notice("Use autocomplete Updated !");
					}, 500)
				);
			});

		//
		// MIN CHARS TO MATCH
		//

		new Setting(containerEl)
			.setName("Minimum characters to Match")
			.setDesc(
				"The minimum amount of characters to open the autocomplete popup"
			)
			.addText((text) => {
				text.setValue(this.plugin.settings.minCharsToMatch.toString());
				text.onChange(
					debounce(async (value: string) => {
						if (!value || value === "") return;
						if (
							isNaN(parseInt(value)) ||
							parseInt(value) < 1 ||
							parseInt(value) >= 10
						) {
							new Notice(
								"Invalid amount, must be between 1 and 9"
							);
							return;
						}
						this.plugin.settings.minCharsToMatch = parseInt(value);
						await this.plugin.saveSettings();
						new Notice("Minimum characters to Match Updated !");
					}, 500)
				);
			});

		//
		//  CATEGORIES
		//

		new Setting(containerEl)
			.setName("categories")
			.setDesc(
				"NOTE: Deleting Existing Category might break the workflow, be sure to dissociate the category from everywhere."
			);
		const typesSection = containerEl.createDiv();
		typesSection.appendChild(this.createNewCategoryBtn());
		typesSection.classList.add("findoc-type-section");

		this.plugin.settings.categories.forEach((category, key) => {
			new Setting(typesSection)
				.setName(`Category`)
				.addText(async (text) => {
					text.setValue(category);
					text.onChange(
						debounce(async (value: string) => {
							this.plugin.settings.categories = Object.assign(
								this.plugin.settings.categories,
								{ [key]: value }
							);
							await this.plugin.saveSettings();
							new Notice("Category Updated !");
						}, 1000)
					);
					text.inputEl.onblur = () => {
						this.display(); // Force refresh.
					};
				})
				.addExtraButton((btn) => {
					btn.setTooltip("Delete Category");
					btn.setIcon("trash");
					btn.onClick(async () => {
						this.plugin.settings.categories.splice(key, 1);
						await this.plugin.saveSettings();
						new Notice("Category Deleted !");
						this.display();
					});
				});
		});

		//
		// MODELS
		//

		new Setting(containerEl)
			.setName("Models")
			.setDesc("Models available (It must be a JSON.stringify version)");
		const div = containerEl.createDiv();
		div.classList.add("findoc-models-container");

		Object.entries(this.plugin.settings.models).forEach(([key, model]) => {
			const name = idToText(key);
			const modelSection = div.createDiv();
			const el = modelSection.createEl("h1");
			el.innerText = "Model: " + name;
			modelSection.classList.add("findoc-model-section");

			// PREPARATION
			new Setting(modelSection)
				.setName(`Data Source for ${name}`)
				.setDesc("Method used to prepare the raw data.")
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
					dropdown.addOption("splitBy", "Split By"); // TODO: need to implement
					dropdown.setValue(
						this.plugin.settings.models[key].dataSource
					);

					dropdown.onChange(async (value) => {
						this.plugin.settings.models[key].dataSource = value;
						await this.plugin.saveSettings();
						new Notice("Data Source Updated !");
					});
				});

			// Custom key `splitBy`
			new Setting(modelSection)
				.setName(`Data Source key for ${name}`)
				.setDesc(
					"Column to use when preparing the raw data. Modify this value exclusively when employing the `Split By` method for the data source."
				)
				.addDropdown((dropdown) => {
					dropdown.addOption("category", "Category");
					dropdown.addOption("subcategory", "SubCategory");
					dropdown.addOption("value", "Value");
					dropdown.addOption("timestamp", "Timestamp");
					dropdown.addOption("extra", "Extra");

					dropdown.setValue(
						this.plugin.settings.models[key].dataSourceKey
					);

					dropdown.onChange(async (value: IDataSourceKeys) => {
						this.plugin.settings.models[key].dataSourceKey = value;
						await this.plugin.saveSettings();
						new Notice("Data Source Key Updated !");
					});
				});

			// OUTPUT
			new Setting(modelSection)
				.setName(`Output Function for ${name}`)
				.setDesc("Method used to show the data in chart or table.")
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
						"Generate Sum Dataset Per Categories"
					);
					dropdown.addOption(
						"generateCumulativeSumDataSet",
						"Generate Cumulative Sum Dataset"
					);
					dropdown.addOption(
						"generateCumulativeSumDataSetPerTypes",
						"Generate Cumulative Sum Dataset Per Categories"
					);
					dropdown.addOption(
						"getLastValuePerTypeForCurrentMonth",
						"Get Last Value Per Category For Current Month"
					);
					dropdown.addOption(
						"generateDifference",
						"Minus(Category1 - Category2)"
					);
					dropdown.addOption(
						"generateSum",
						"Sum(Category1 + Category2)"
					);
					dropdown.addOption(
						"reportDifference",
						"Report: Minus(Category1 - Category2)"
					);
					dropdown.addOption(
						"reportSum",
						"Report: Sum(Category1 + Category2)"
					);

					dropdown.setValue(this.plugin.settings.models[key].output);

					dropdown.onChange(async (value) => {
						this.plugin.settings.models[key].output = value;
						await this.plugin.saveSettings();
						new Notice("Output Updated !");
					});
				});

			//
			// BEGIN AT ZERO
			//
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

			//
			// CHART LABEL TYPES; MONEY, PERCENT, GENERIC, CUSTOM
			//
			const h2ChartType = modelSection.createEl("h2");
			h2ChartType.innerText = `Chart Label Type for ${name}`;

			const wrapperChartType = modelSection.createDiv();
			wrapperChartType.classList.add("findoc-model-section-wrapper");

			const chartLabelType = wrapperChartType.createEl("select");
			chartLabelType.id = `chart-label-type-${key}`;
			chartLabelType.multiple = false;
			chartLabelType.classList.add("findoc-select-one");

			chartLabelType.setAttribute("value", model.chartLabelType);
			chartLabelType.onchange = async () => {
				const selected = [];
				for (const option of (
					document.getElementById(
						`chart-label-type-${key}`
					) as HTMLSelectElement
				).options as any) {
					if (option.selected) {
						selected.push(option.value);
					}
				}
				model.chartLabelType = selected[0];
				await this.plugin.saveSettings();
				new Notice("Label Type Updated !");
			};
			this.plugin.settings.chartLabelTypes.forEach(
				(labelType: string) => {
					const opt = chartLabelType.createEl("option");
					opt.id = labelType;
					opt.value = labelType;
					opt.innerText = labelType;
					opt.selected = model.chartLabelType === labelType;
				}
			);

			//
			// SUFFIX
			//
			new Setting(modelSection)
				.setDisabled(model.chartLabelType !== "custom")
				.setName("Suffix")
				.setDesc(
					`Optional Suffix, only used when the chart label type is set to "custom"`
				)
				.addText((text) => {
					text.setValue(model.suffix);
					text.onChange(
						debounce(async (value: string) => {
							model.suffix = value || "";
							await this.plugin.saveSettings();
							new Notice("Suffix Updated !");
						}, 500)
					);
				});

			//
			// categories
			//
			const h2 = modelSection.createEl("h2");
			h2.innerText = `Categories for ${name}`;

			const wrapper = modelSection.createDiv();
			wrapper.classList.add("findoc-model-section-wrapper");

			const select = wrapper.createEl("select");
			select.id = key;
			select.multiple = true;
			select.classList.add("findoc-select");

			select.setAttribute("value", model.categories.join(","));
			select.onchange = async () => {
				const selected = [];
				// @ts-ignore
				for (const option of document.getElementById(key).options) {
					if (option.selected) {
						selected.push(option.value);
					}
				}
				model.categories = selected;
				await this.plugin.saveSettings();
				new Notice("Categories Updated !");
			};

			this.getCategories().forEach((category: string) => {
				const opt = select.createEl("option");
				opt.id = category;
				opt.value = category;
				opt.innerText = category;
				opt.selected = model.categories.includes(category);
			});

			//
			// VALUES (Comma delimited list to specify the values to substract)
			//
			new Setting(modelSection)
				.setDisabled(model.output !== "generateDifference")
				.setName("Values")
				.setDesc(
					`Comma delimited list of two values.\nOnly used when the output is set to "generateDifference".\nExample: "Income, Expenses" will produce: Income - Expenses`
				)
				.addText((text) => {
					text.setValue(model.values);
					text.onChange(
						debounce(async (value: string) => {
							model.values = value || "";
							await this.plugin.saveSettings();
							new Notice("Values Updated !");
						}, 500)
					);
				});
			modelSection.createEl("hr");
		});

		//
		//  COLORS
		//

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
