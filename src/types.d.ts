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
		data: any;
		segment: {
			borderColor?: any;
			borderDash: any;
		};
	}[];
}

interface ITooltip {
	dataset: {
		label: string;
		data: any[];
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
}

interface IModel {
	dataSource: string;
	categories: string[];
	output: string;
	beginAtZero: boolean;
}
