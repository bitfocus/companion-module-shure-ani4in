import { Choices } from './config.js'

export function updateActions(self) {
	self.setActionDefinitions({
		// ──────────────────────────── Audio Mute ────────────────────────────
		set_audio_mute: {
			name: 'Set Audio Mute',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.Channels,
					default: '1',
				},
				{
					id: 'state',
					type: 'dropdown',
					label: 'State',
					choices: Choices.OnOffToggle,
					default: 'TOGGLE',
				},
			],
			callback: async ({ options }) => {
				self.api.sendCommand(`SET ${options.channel} AUDIO_MUTE ${options.state}`)
			},
		},

		// ──────────────────────────── Analog Gain ────────────────────────────
		set_analog_gain: {
			name: 'Set Analog Gain',
			description: '0-51 dB in 3 dB steps',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
				{
					id: 'gain',
					type: 'number',
					label: 'Gain (dB)',
					default: 0,
					min: 0,
					max: 51,
					step: 3,
				},
			],
			callback: async ({ options }) => {
				const val = String(options.gain).padStart(2, '0')
				self.api.sendCommand(`SET ${options.channel} AUDIO_GAIN ${val}`)
			},
		},

		adjust_analog_gain: {
			name: 'Adjust Analog Gain',
			description: 'Increase or decrease analog gain by a step amount (3 dB steps)',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.Channels,
					default: '1',
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					choices: Choices.GainIncDec,
					default: 'INC',
				},
				{
					id: 'amount',
					type: 'number',
					label: 'Amount (dB, multiples of 3)',
					default: 3,
					min: 3,
					max: 51,
					step: 3,
				},
			],
			callback: async ({ options }) => {
				const val = String(options.amount).padStart(2, '0')
				self.api.sendCommand(`SET ${options.channel} AUDIO_GAIN ${options.direction} ${val}`)
			},
		},

		// ──────────────────────────── Digital Gain ────────────────────────────
		set_digital_gain: {
			name: 'Set Digital Gain (Hi-Res)',
			description: '0.0-140.0 dB in 0.1 dB steps (value x10)',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
				{
					id: 'gain',
					type: 'number',
					label: 'Gain (dB, 0.1 step)',
					default: 0,
					min: 0,
					max: 140,
					step: 0.1,
				},
			],
			callback: async ({ options }) => {
				const val = String(Math.round(options.gain * 10)).padStart(4, '0')
				self.api.sendCommand(`SET ${options.channel} AUDIO_GAIN_HI_RES ${val}`)
			},
		},

		adjust_digital_gain: {
			name: 'Adjust Digital Gain (Hi-Res)',
			description: 'Increase or decrease digital gain (0.1 dB steps)',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					choices: Choices.GainIncDec,
					default: 'INC',
				},
				{
					id: 'amount',
					type: 'number',
					label: 'Amount (dB)',
					default: 1,
					min: 0.1,
					max: 140,
					step: 0.1,
				},
			],
			callback: async ({ options }) => {
				const val = String(Math.round(options.amount * 10))
				self.api.sendCommand(`SET ${options.channel} AUDIO_GAIN_HI_RES ${options.direction} ${val}`)
			},
		},

		// ──────────────────────────── Phantom Power ────────────────────────────
		set_phantom_power: {
			name: 'Set Phantom Power (+48V)',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
				{
					id: 'state',
					type: 'dropdown',
					label: 'State',
					choices: Choices.OnOff,
					default: 'ON',
				},
			],
			callback: async ({ options }) => {
				self.api.sendCommand(`SET ${options.channel} PHANTOM_PWR_ENABLE ${options.state}`)
			},
		},

		toggle_phantom_power: {
			name: 'Toggle Phantom Power (+48V)',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
			],
			callback: async ({ options }) => {
				const ch = self.api.getChannel(options.channel)
				const newState = ch && ch.phantom_pwr === 'ON' ? 'OFF' : 'ON'
				self.api.sendCommand(`SET ${options.channel} PHANTOM_PWR_ENABLE ${newState}`)
			},
		},

		// ──────────────────────────── Mute All ────────────────────────────
		mute_all: {
			name: 'Mute All Channels',
			options: [],
			callback: async () => {
				self.api.sendCommand('SET 0 AUDIO_MUTE ON')
			},
		},

		unmute_all: {
			name: 'Unmute All Channels',
			options: [],
			callback: async () => {
				self.api.sendCommand('SET 0 AUDIO_MUTE OFF')
			},
		},

		// ──────────────────────────── LED Brightness ────────────────────────────
		set_led_brightness: {
			name: 'Set LED Brightness',
			options: [
				{
					id: 'brightness',
					type: 'dropdown',
					label: 'Brightness',
					choices: Choices.LedBrightness,
					default: '2',
				},
			],
			callback: async ({ options }) => {
				self.api.sendCommand(`SET LED_BRIGHTNESS ${options.brightness}`)
			},
		},

		// ──────────────────────────── Flash (Identify) ────────────────────────────
		set_flash: {
			name: 'Flash LEDs (Identify)',
			description: 'Flash device LEDs for identification (auto-off after 30s)',
			options: [
				{
					id: 'state',
					type: 'dropdown',
					label: 'State',
					choices: Choices.OnOff,
					default: 'ON',
				},
			],
			callback: async ({ options }) => {
				self.api.sendCommand(`SET FLASH ${options.state}`)
			},
		},

		// ──────────────────────────── Audio Summing Mode ────────────────────────────
		set_audio_summing_mode: {
			name: 'Set Audio Summing Mode',
			description: 'Firmware > v2.0',
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					choices: Choices.AudioSummingMode,
					default: 'OFF',
				},
			],
			callback: async ({ options }) => {
				self.api.sendCommand(`SET AUDIO_SUMMING_MODE ${options.mode}`)
			},
		},

		// ──────────────────────────── Input Meter Mode ────────────────────────────
		set_input_meter_mode: {
			name: 'Set Input Meter Mode',
			description: 'Firmware > v2.0',
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					choices: Choices.InputMeterMode,
					default: 'PRE_FADER',
				},
			],
			callback: async ({ options }) => {
				self.api.sendCommand(`SET INPUT_METER_MODE ${options.mode}`)
			},
		},

		// ──────────────────────────── Channel LED In State ────────────────────────────
		set_chan_led_in_state: {
			name: 'Set Mic Logic LED In',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.Channels,
					default: '1',
				},
				{
					id: 'state',
					type: 'dropdown',
					label: 'State',
					choices: Choices.OnOff,
					default: 'ON',
				},
			],
			callback: async ({ options }) => {
				self.api.sendCommand(`SET ${options.channel} CHAN_LED_IN_STATE ${options.state}`)
			},
		},

		// ──────────────────────────── Presets ────────────────────────────
		recall_preset: {
			name: 'Recall Preset',
			options: [
				{
					id: 'preset',
					type: 'dropdown',
					label: 'Preset',
					choices: Choices.Presets,
					default: '1',
				},
			],
			callback: async ({ options }) => {
				self.api.sendCommand(`SET PRESET ${options.preset}`)
			},
		},

		// ──────────────────────────── PEQ Filter ────────────────────────────
		set_peq_filter: {
			name: 'Set PEQ Filter Enable',
			description: 'Firmware > v2.0',
			options: [
				{
					id: 'block',
					type: 'dropdown',
					label: 'PEQ Block',
					choices: Choices.PeqBlocks,
					default: '01',
				},
				{
					id: 'filter',
					type: 'dropdown',
					label: 'PEQ Filter',
					choices: Choices.PeqFilters,
					default: '01',
				},
				{
					id: 'state',
					type: 'dropdown',
					label: 'State',
					choices: Choices.OnOff,
					default: 'ON',
				},
			],
			callback: async ({ options }) => {
				self.api.sendCommand(`SET ${options.block} PEQ ${options.filter} ${options.state}`)
			},
		},

		// ──────────────────────────── Metering ────────────────────────────
		set_metering: {
			name: 'Set Metering Rate',
			description: 'Set metering sample rate (0 = off, minimum 100ms)',
			options: [
				{
					id: 'rate',
					type: 'number',
					label: 'Rate (ms, 0=off)',
					default: 0,
					min: 0,
					max: 99999,
				},
			],
			callback: async ({ options }) => {
				const val = String(options.rate).padStart(5, '0')
				self.api.sendCommand(`SET METER_RATE ${val}`)
			},
		},

		// ──────────────────────────── Restore Defaults ────────────────────────────
		restore_defaults: {
			name: 'Restore Default Settings',
			description: 'Firmware > v2.0 - Restores factory defaults',
			options: [],
			callback: async () => {
				self.api.sendCommand('SET DEFAULT_SETTINGS')
			},
		},

		// ──────────────────────────── Reboot ────────────────────────────
		reboot: {
			name: 'Reboot Device',
			description: 'Firmware > v2.0',
			options: [],
			callback: async () => {
				self.api.sendCommand('SET REBOOT')
			},
		},

		// ──────────────────────────── Query Levels ────────────────────────────
		get_audio_levels: {
			name: 'Query Audio Levels',
			description: 'Firmware > v2.0 - Request RMS and peak audio levels',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.Channels,
					default: '0',
				},
			],
			callback: async ({ options }) => {
				self.api.sendCommand(`GET ${options.channel} AUDIO_IN_RMS_LVL`)
				self.api.sendCommand(`GET ${options.channel} AUDIO_IN_PEAK_LVL`)
			},
		},
	})
}
