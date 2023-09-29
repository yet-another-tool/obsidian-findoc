interface IInput {
	type: string;
	id: string;
	value: number;
	timestamp: Date;
	extra: string;
}

interface IDataset {
	labels: string[];
	datasets: {
		label: string;
		borderColor: string;
		fill: boolean;
		tension: number;
		data: number[];
		segment: {
			borderColor?: (ctx: IContext) => string | Array<number> | undefined;
			borderDash: (ctx: IContext) => string | Array<number> | undefined;
		};
	}[];
}

interface ITooltip {
	dataset: {
		label: string;
		data: number[];
	};
	parsed: {
		y: number;
	};
	dataIndex: number;
}

interface IPluginSettings {
	models: {
		[key: string]: IModel;
	};
	colors: string[];
	debounce: string;
	csvSeparator: string;
	useLastElementAsTemplate: boolean;
	useAutocomplete: boolean;
	types: string[];
}

interface IModel {
	dataSource: string;
	types: string[];
	output: string;
	beginAtZero: boolean;
	type: "money" | "percent";
	date?: string;
}

interface IEvent {
	target: {
		innerHTML: string;
	};
}

interface IChartLine {
	type: "line";
	data: IDataset;
	options: {
		interaction: {
			intersect: boolean;
		};
		scales: {
			y: {
				beginAtZero: boolean;
			};
		};
		plugins: {
			tooltip: {
				callbacks: {
					label: (context: ITooltip) => string;
				};
			};
		};
	};
}

interface IContext {
	p0: { skip: boolean };
	p1: { skip: boolean };
}

interface IReportData {
	datasets: IReportEntry[];
}

interface IReportEntry {
	label: string;
	data: number;
	date: string;
}
