import { Vault } from "obsidian";

export async function loadCSVData(vault: Vault, filenames: string[]) {
	let data: string[] = [];
	for (const filename of filenames) {
		const content = await vault.adapter.read(filename);
		data = [...data, ...content.split(/\r?\n/).slice(1)];
	}
	return data.filter((line) => line.trim() !== "").join("\n");
}
