import { TextFileView } from "obsidian";

export const VIEW_TYPE_CSV = "csv-view";

export class CSVView extends TextFileView {
	tableData: string[];

	getViewData() {
		return this.tableData.join("\n");
	}

	setViewData(data: string, clear: boolean) {
		this.tableData = data.split("\n");

		this.refresh();
	}

	refresh() {
		const div = this.contentEl.createDiv();
		div.contentEditable = "true";
		div.innerText = this.data;
		div.oninput = (ev: any) => {
			const csvFormat = ev.target.innerHTML
				.replaceAll("<br>", "\n")
				.replaceAll("<div>", "\n")
				.replaceAll("</div>", "");

			this.tableData = csvFormat.split("\n");
			this.requestSave();
		};
	}

	clear() {
		this.tableData = [];
	}

	getViewType() {
		return VIEW_TYPE_CSV;
	}

	async onOpen() {
		this.tableData = [];
	}

	async onClose() {
		this.tableData = [];
	}
}
