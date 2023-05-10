import FinDocPlugin from "main";
import { Notice, TextFileView, WorkspaceLeaf, debounce } from "obsidian";
import { getToday } from "utils";
import { types } from "./constants";

export const VIEW_TYPE_CSV = "csv-view";

export class CSVView extends TextFileView {
	plugin: FinDocPlugin;
	tableData: string[];
	tableHeader: string;
	div: HTMLElement;
	parent: HTMLElement;

	constructor(leaf: WorkspaceLeaf, plugin: FinDocPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewData() {
		return this.tableData.join("\n");
	}

	dropdown(selected = ""): HTMLElement {
		const id = new Date().getTime().toString();
		const dropdown = this.contentEl.createEl("select");
		dropdown.id = id;
		dropdown.setAttribute("value", selected);
		dropdown.onchange = () => {
			dropdown.setAttribute("value", dropdown.value);
		};

		types.forEach((option: string) => {
			const opt = this.contentEl.createEl("option");
			opt.value = option;
			opt.id = id + option.replace(" ", "_");
			opt.innerText = option;
			if (option === selected) opt.selected = true;
			dropdown.appendChild(opt);
		});

		return dropdown;
	}

	createTable(data: string[]) {
		this.div = this.contentEl.createDiv();
		const table = this.contentEl.createEl("table");

		//
		// Table Header
		//
		this.tableHeader = data[0];
		const headers = this.tableHeader.split(
			this.plugin.settings.csvSeparator
		);
		const trHeaders = this.contentEl.createEl("tr");
		headers.forEach((header) => {
			const th = this.contentEl.createEl("th");
			th.innerText = header;
			trHeaders.appendChild(th);
		});
		this.div.appendChild(trHeaders);

		//
		// Table Content
		//
		data.slice(1).forEach((line) => {
			const trContent = this.contentEl.createEl("tr");
			const lineData = line.split(this.plugin.settings.csvSeparator);
			lineData.push("ACTION");
			lineData.forEach((el, idx) => {
				const td = this.contentEl.createEl("td");
				td.id = `data_${idx}`;
				td.classList.add("findoc-line-data");
				if (idx === 0) {
					td.appendChild(this.dropdown(el));
				} else if (idx === lineData.length - 1) {
					td.appendChild(this.createBtnRemoveLine(trContent));
				} else {
					td.innerText = el;
					td.contentEditable = "true";
				}

				trContent.appendChild(td);
			});
			this.div.appendChild(trContent);
		});

		table.appendChild(this.div);
		this.parent.appendChild(table);

		this.createBtnAddLine();
	}

	createBtnRemoveLine(el: HTMLElement): HTMLElement {
		const btn = this.contentEl.createEl("button");

		btn.classList.add("findoc-btn-margin-top");
		btn.id = "deleteRow";
		btn.innerText = "Delete";
		btn.onClickEvent(() => {
			el.empty();
			this.saveData();
		});

		return btn;
	}

	createBtnAddLine() {
		const btn = this.contentEl.createEl("button");
		btn.classList.add("findoc-btn-margin-top");
		btn.id = "newRow";
		btn.innerText = "Add New Row";
		btn.onClickEvent(() => {
			const trContent = this.contentEl.createEl("tr");
			const lineData = [
				types[0],
				"ID",
				"0",
				getToday(),
				"EXTRA",
				"ACTION",
			];
			lineData.forEach((el, idx) => {
				const td = this.contentEl.createEl("td");
				td.classList.add("findoc-line-data");
				if (idx === 0) {
					td.appendChild(this.dropdown(el));
				} else if (idx === lineData.length - 1) {
					td.appendChild(this.createBtnRemoveLine(trContent));
				} else {
					td.innerText = el;
					td.contentEditable = "true";
				}
				trContent.appendChild(td);
			});
			this.div.appendChild(trContent);
		});
		this.parent.appendChild(btn);
	}

	setViewData(data: string, clear: boolean) {
		if (clear) this.clear();
		this.tableData = data.split("\n");
		this.parent = this.contentEl.createDiv();
		this.createTable(this.tableData);

		// Margin to avoid having the iphone keyboard hide last lines
		this.parent.classList.add("findoc-csv-parent");
		this.refresh();
	}

	refresh() {
		this.div.oninput = debounce(() => {
			this.saveData();
		}, parseInt(this.plugin.settings.debounce) || 1000);
	}

	saveData() {
		const rows = this.div.innerHTML.split(new RegExp(/<tr.*?>/));
		this.tableData = rows
			.map((column) =>
				column
					.split(new RegExp(/<td.*?>/))
					.slice(1)
					.filter((i) => !new RegExp(/<button.*?>.*<.*?>/).test(i))
					.map((i, idx) => {
						if (idx === 0) {
							// Select (Dropdown)
							return (
								i.split('value="')[1].split('"')[0] || types[0]
							);
						} else {
							// Input field
							return i
								.replaceAll(/<.*?>/g, "")
								.replaceAll(
									'&lt;br class="Apple-interchange-newline"&gt',
									""
								);
						}
					})
					.join(this.plugin.settings.csvSeparator)
			)
			// Clear empty lines
			.filter((r) => r.length !== 0);

		this.tableData = [this.tableHeader, ...this.tableData];
		this.requestSave();

		// TODO: Replace this timeout with the proper and recommended way.
		new Notice("Saving in progress...", 2005);
		debounce(() => {
			new Notice("File Saved !", 600);
		}, 2005);
	}

	clear() {
		this.tableData = [];
		if (this.div) this.div.empty();
		if (this.parent) this.parent.empty();
		this.contentEl.empty();
	}

	getViewType() {
		return VIEW_TYPE_CSV;
	}
}
