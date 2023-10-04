import { IInput } from "types";

export function getData(csv: string, separator = ","): Array<IInput> {
	return csv
		.split("\n")
		.filter(
			(line, idx) =>
				idx !== 0 && line !== "" && line.split(separator).length === 5
		)
		.map((line) => {
			return {
				category: line.split(separator)[0],
				subcategory: line.split(separator)[1],
				value:
					parseFloat(line.split(separator)[2]) !== 0
						? parseFloat(line.split(separator)[2])
						: 0,
				timestamp: new Date(line.split(separator)[3]),
				extra: line.split(separator)[4],
			};
		})
		.sort((a, b) => {
			return (
				new Date(a.timestamp).getTime() -
				new Date(b.timestamp).getTime()
			);
		});
}
