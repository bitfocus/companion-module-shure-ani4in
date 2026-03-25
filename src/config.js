export const DEVICE_PORT = 2202

export const Choices = {
	Channels: [
		{ id: '0', label: 'All Channels' },
		{ id: '1', label: 'Channel 1' },
		{ id: '2', label: 'Channel 2' },
		{ id: '3', label: 'Channel 3' },
		{ id: '4', label: 'Channel 4' },
	],
	ChannelsOnly: [
		{ id: '1', label: 'Channel 1' },
		{ id: '2', label: 'Channel 2' },
		{ id: '3', label: 'Channel 3' },
		{ id: '4', label: 'Channel 4' },
	],
	OnOff: [
		{ id: 'ON', label: 'On' },
		{ id: 'OFF', label: 'Off' },
	],
	OnOffToggle: [
		{ id: 'ON', label: 'On' },
		{ id: 'OFF', label: 'Off' },
		{ id: 'TOGGLE', label: 'Toggle' },
	],
	LedBrightness: [
		{ id: '0', label: 'Disabled' },
		{ id: '1', label: 'Dim' },
		{ id: '2', label: 'Default' },
	],
	AudioSummingMode: [
		{ id: 'OFF', label: 'Off' },
		{ id: '1+2', label: '1+2' },
		{ id: '3+4', label: '3+4' },
		{ id: '1+2/3+4', label: '1+2 / 3+4' },
		{ id: '1+2+3+4', label: '1+2+3+4' },
	],
	InputMeterMode: [
		{ id: 'PRE_FADER', label: 'Pre-Fader' },
		{ id: 'POST_FADER', label: 'Post-Fader' },
	],
	GainIncDec: [
		{ id: 'INC', label: 'Increase' },
		{ id: 'DEC', label: 'Decrease' },
	],
	Presets: Array.from({ length: 10 }, (_, i) => ({
		id: String(i + 1),
		label: `Preset ${i + 1}`,
	})),
	PeqBlocks: [
		{ id: '00', label: 'All Blocks' },
		{ id: '01', label: 'Block 1' },
		{ id: '02', label: 'Block 2' },
		{ id: '03', label: 'Block 3' },
		{ id: '04', label: 'Block 4' },
	],
	PeqFilters: [
		{ id: '00', label: 'All Filters' },
		{ id: '01', label: 'Filter 1' },
		{ id: '02', label: 'Filter 2' },
		{ id: '03', label: 'Filter 3' },
		{ id: '04', label: 'Filter 4' },
	],
	LimiterChannels: [
		{ id: '1', label: 'Channel 1' },
		{ id: '3', label: 'Channel 3' },
	],
}

export function getConfigFields() {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			default: '',
		},
		{
			type: 'number',
			id: 'port',
			label: 'Port',
			width: 4,
			default: DEVICE_PORT,
			min: 1,
			max: 65535,
		},
		{
			type: 'checkbox',
			id: 'metering_enabled',
			label: 'Enable Audio Metering',
			width: 6,
			default: false,
		},
		{
			type: 'number',
			id: 'metering_rate',
			label: 'Metering Rate (ms)',
			width: 6,
			default: 500,
			min: 100,
			max: 99999,
			isVisible: (config) => config.metering_enabled,
		},
		{
			type: 'number',
			id: 'poll_interval',
			label: 'Polling Interval (seconds)',
			width: 6,
			default: 30,
			min: 5,
			max: 300,
		},
	]
}
