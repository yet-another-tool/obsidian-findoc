import FinDocPlugin from "main";
import {
	Notice,
	TextFileView,
	WorkspaceLeaf,
	debounce as _debounce,
} from "obsidian";
import { debounce } from "utils";

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

	createTable(data: string[]) {
		this.div = this.contentEl.createDiv();
		this.div.contentEditable = "true";
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
			line.split(this.plugin.settings.csvSeparator).forEach((el) => {
				const td = this.contentEl.createEl("td");
				td.style.borderColor = "white";
				td.style.border = "1px solid";
				td.style.padding = "3px";
				td.style.textAlign = "center";
				td.style.minWidth = "150px";
				td.innerText = el;
				trContent.appendChild(td);
			});
			this.div.appendChild(trContent);
		});

		table.appendChild(this.div);
		this.parent.appendChild(table);

		//
		// Button
		//
		const btn = this.contentEl.createEl("button");
		btn.style.marginTop = "10px";
		btn.id = "newRow";
		btn.innerText = "Add New Row";
		btn.onClickEvent(() => {
			const trContent = this.contentEl.createEl("tr");
			[
				"__type__",
				"__id__",
				"__value__",
				"__timestamp__",
				"__extra__",
			].forEach((el) => {
				const td = this.contentEl.createEl("td");
				td.style.borderColor = "white";
				td.style.border = "1px solid";
				td.style.padding = "3px";
				td.style.textAlign = "center";
				td.style.minWidth = "150px";
				td.innerText = el;
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
		this.parent.style.marginBottom = "50px";
		this.refresh();
	}

	refresh() {
		this.div.oninput = debounce((ev: IEvent) => {
			const rows = ev.target.innerHTML.split(new RegExp(/<tr.*?>/));
			this.tableData = this.tableData = rows
				.map((column) =>
					column
						.split(new RegExp(/<td.*?>/))
						.slice(1)
						.map((i) =>
							i
								.replaceAll(/<.*?>/g, "")
								.replaceAll(
									'&lt;br class="Apple-interchange-newline"&gt',
									""
								)
						)
						.join(this.plugin.settings.csvSeparator)
				)
				.filter((r) => r.length !== 0);

			this.tableData = [this.tableHeader, ...this.tableData];
			this.requestSave();

			// TODO: Replace this timeout with the proper and recommended way.
			new Notice("Saving in progress...", 2005);
			_debounce(() => {
				new Notice("File Saved !", 600);
			}, 2005);
		}, parseInt(this.plugin.settings.debounce));
	}

	clear() {
		this.tableData = [];
		this.div.empty();
		this.parent.empty();
		this.contentEl.empty();
	}

	getViewType() {
		return VIEW_TYPE_CSV;
	}
}
