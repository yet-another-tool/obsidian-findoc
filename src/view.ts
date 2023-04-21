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
	div: HTMLElement;

	constructor(leaf: WorkspaceLeaf, plugin: FinDocPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewData() {
		return this.tableData.join("\n");
	}

	setViewData(data: string, clear: boolean) {
		if (clear) this.clear();
		this.tableData = data.split("\n");
		this.div = this.contentEl.createDiv();
		this.div.contentEditable = "true";
		this.div.innerText = this.data;
		// Margin to avoid having the iphone keyboard hide last lines
		this.div.style.marginBottom = "50px";

		this.refresh();
	}

	refresh() {
		this.div.oninput = debounce((ev: IEvent) => {
			const csvFormat = ev.target.innerHTML
				.replaceAll("<br>", "\n")
				.replaceAll("<div>", "\n")
				.replaceAll("</div>", "")
				.replace(/<.*>/g, "")
				.replaceAll('&lt;br class="Apple-interchange-newline"&gt', "");

			this.tableData = csvFormat.split("\n");

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
		this.contentEl.empty();
	}

	getViewType() {
		return VIEW_TYPE_CSV;
	}
}
