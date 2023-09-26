import { Vault } from "obsidian";

export async function loadCSVData(vault: Vault, filenames: string[]) {
	let data = "";
	for (const filename of filenames) {
		data += await vault.adapter.read(filename);
		data += "\n";
	}
	return data;
}
