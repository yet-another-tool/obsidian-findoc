import { readFileSync } from "fs";

export function loadCSV(filenames: string[]) {
	let data: string[] = [];
	for (const filename of filenames) {
		const content = readFileSync(filename, "utf-8");
		data = [...data, ...content.split(/\r?\n/).slice(1)];
	}
	return data.filter((line) => line.trim() !== "").join("\n");
}

export function difference(array1: number[], array2: number[]) {
	return array1.map((n, idx) => n - array2[idx]);
}

export function sum(array1: number[], array2: number[]) {
	return array1.map((n, idx) => n + array2[idx]);
}

export function min(array: number[]) {
	array.reduce((min, currentValue) => {
		if (currentValue < min) min = currentValue;
		return min;
	}, 0);
}

export function max(array: number[]) {
	array.reduce((max, currentValue) => {
		if (currentValue > max) max = currentValue;
		return max;
	}, 0);
}

export function average(array: number[]) {
	return (
		array.reduce((sum, currentValue) => {
			return sum + currentValue;
		}, 0) / array.length
	);
}

export function median(array: number[]) {
	return array.sort()[Math.floor(array.length / 2)];
}
