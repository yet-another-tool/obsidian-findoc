import { Notice, TextFileView } from "obsidian";
import { debounce } from "utils";

export const VIEW_TYPE_CSV = "csv-view";

export class CSVView extends TextFileView {
	tableData: string[];
	div: HTMLElement;

	getViewData() {
		return this.tableData.join("\n");
	}

	setViewData(data: string, clear: boolean) {
		if (clear) this.clear();
		this.tableData = data.split("\n");
		this.div = this.contentEl.createDiv();
		this.div.contentEditable = "true";
		this.div.innerText = this.data;

		this.refresh();
	}

	refresh() {
		this.div.oninput = debounce((ev: any) => {
			const csvFormat = ev.target.innerHTML
				.replaceAll("<br>", "\n")
				.replaceAll("<div>", "\n")
				.replaceAll("</div>", "")
				.replace(/<.*>/g, "")
				.replaceAll('&lt;br class="Apple-interchange-newline"&gt', "");

			this.tableData = csvFormat.split("\n");

			this.requestSave();

			new Notice("Saving in progress...", 2005);
			setTimeout(() => {
				new Notice("File Saved !", 600);
			}, 2005);
		}, 500);
	}

	clear() {
		this.tableData = [];
		this.contentEl.empty();
	}

	getViewType() {
		return VIEW_TYPE_CSV;
	}

	async onOpen() {
		this.tableData = [];
	}

	async onClose() {
		this.requestSave();
	}
}
