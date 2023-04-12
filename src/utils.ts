/* UTILS */
export function debounce(func: any, delay = 250) {
	let timerId: string | number | NodeJS.Timeout;
	return (...args: any[]) => {
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}
