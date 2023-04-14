import { COLORS } from "defaults";

let colors: string[] = [];

export function resetColors(): void {
	colors = COLORS;
}

export function getColor(): string {
	const c = colors[0];
	colors.shift();

	return c;
}
