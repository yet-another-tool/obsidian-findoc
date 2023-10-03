export type IInput = {
	type: string;
	id: string;
	value: number;
	timestamp: Date;
	extra: string;
};

export type IDataset = {
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
};

export type ITooltip = {
	dataset: {
		label: string;
		data: number[];
	};
	parsed: {
		y: number;
	};
	dataIndex: number;
};

export type IPluginSettings = {
	models: {
		[key: string]: IModel;
	};
	colors: string[];
	debounce: string;
	csvSeparator: string;
	useLastElementAsTemplate: boolean;
	useAutocomplete: boolean;
	minCharsToMatch: number;
	categories: string[];
	chartLabelTypes: string[];
};

export type IChartLabelTypes = "money" | "percent" | "generic" | "custom";

export type IModel = {
	dataSource: string;
	categories: string[];
	output: string;
	beginAtZero: boolean;
	chartLabelType: IChartLabelTypes;
	suffix?: string;
	date?: string;
};

export type IEvent = {
	target: {
		innerHTML: string;
	};
};

export type IChartLine = {
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
};

export type IContext = {
	p0: { skip: boolean };
	p1: { skip: boolean };
};

export type IReportData = {
	datasets: IReportEntry[];
};

export type IReportEntry = {
	label: string;
	data: number;
	date: string;
};
