/* UTILS */
export const debounce = (func: any, wait = 500) => {
	let timeout: string | number | NodeJS.Timeout;
	return function executedFunction(...args: any) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

/* Date */
export function getMonth(d: Date): string | number {
	if (d.getUTCMonth() + 1 < 10) return "0" + (d.getUTCMonth() + 1);
	return d.getUTCMonth() + 1;
}

export function getDate(d: Date): string | number {
	if (d.getUTCDate() < 10) return "0" + d.getUTCDate();
	return d.getUTCDate();
}

// In UTC Format.
export function getToday() {
	const d = new Date();
	return `${d.getFullYear()}-${getMonth(d)}-${getDate(d)}`;
}

/* ChartJS */
export const skipped = (
	ctx: IContext,
	value: string | Array<number>
): string | Array<number> | undefined =>
	ctx.p0.skip || ctx.p1.skip ? value : undefined;

// Convert id Camel Case to text
export const idToText = (id: string): string => {
	return `${id.charAt(0).toUpperCase()}${id
		.slice(1)
		.replace(/([A-Z])/g, " $1")}`;
};
