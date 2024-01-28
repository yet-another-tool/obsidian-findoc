import { DEFAULT_SETTINGS } from "defaults";
import FinDocPlugin from "main";
import { IPluginSettings } from "types";

export async function reloadDefaultConfiguration(
	settings: IPluginSettings,
	plugin: FinDocPlugin
) {
	settings.models = DEFAULT_SETTINGS.models;
	await plugin.saveSettings();
}
