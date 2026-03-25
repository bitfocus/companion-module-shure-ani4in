import { combineRgb } from '@companion-module/base'
import { Choices } from './config.js'

export function updateFeedbacks(self) {
	self.setFeedbackDefinitions({
		// ──────────────────────────── Audio Mute ────────────────────────────
		audio_mute: {
			name: 'Channel Muted',
			type: 'boolean',
			description: 'Change style when channel is muted',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
			],
			callback: ({ options }) => {
				const ch = self.api.getChannel(options.channel)
				return ch ? ch.audio_mute === 'ON' : false
			},
		},

		// ──────────────────────────── Phantom Power ────────────────────────────
		phantom_power: {
			name: 'Phantom Power Active',
			type: 'boolean',
			description: 'Change style when phantom power is enabled',
			defaultStyle: {
				bgcolor: combineRgb(255, 128, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
			],
			callback: ({ options }) => {
				const ch = self.api.getChannel(options.channel)
				return ch ? ch.phantom_pwr === 'ON' : false
			},
		},

		// ──────────────────────────── Signal/Clip LED ────────────────────────────
		sig_clip_color: {
			name: 'Signal/Clip LED Color',
			type: 'boolean',
			description: 'Change style based on signal/clip LED color',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
				{
					id: 'color',
					type: 'dropdown',
					label: 'LED Color',
					choices: [
						{ id: 'GREEN', label: 'Green (Signal)' },
						{ id: 'AMBER', label: 'Amber (High)' },
						{ id: 'RED', label: 'Red (Clip)' },
					],
					default: 'RED',
				},
			],
			callback: ({ options }) => {
				const ch = self.api.getChannel(options.channel)
				return ch ? ch.led_color_sig_clip === options.color : false
			},
		},

		signal_present: {
			name: 'Signal Present',
			type: 'boolean',
			description: 'Change style when any signal is detected (green, amber, or red)',
			defaultStyle: {
				bgcolor: combineRgb(0, 204, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
			],
			callback: ({ options }) => {
				const ch = self.api.getChannel(options.channel)
				return ch ? ch.led_color_sig_clip !== 'OFF' : false
			},
		},

		// ──────────────────────────── Clip Indicator ────────────────────────────
		clip_indicator: {
			name: 'Audio Clip Indicator',
			type: 'boolean',
			description: 'Change style when audio is clipping',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
			],
			callback: ({ options }) => {
				const ch = self.api.getChannel(options.channel)
				return ch ? ch.audio_clip_indicator === 'ON' : false
			},
		},

		// ──────────────────────────── HW Gating Logic ────────────────────────────
		hw_gating_logic: {
			name: 'Hardware Gating Logic',
			type: 'boolean',
			description: 'Change style when mic logic gate is active',
			defaultStyle: {
				bgcolor: combineRgb(0, 204, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
			],
			callback: ({ options }) => {
				const ch = self.api.getChannel(options.channel)
				return ch ? ch.hw_gating_logic === 'ON' : false
			},
		},

		// ──────────────────────────── Limiter Engaged ────────────────────────────
		limiter_engaged: {
			name: 'Limiter Engaged',
			type: 'boolean',
			description: 'Change style when limiter is engaged (summing mode only, ch 1 or 3)',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.LimiterChannels,
					default: '1',
				},
			],
			callback: ({ options }) => {
				const ch = self.api.getChannel(options.channel)
				return ch ? ch.limiter_engaged === 'ON' : false
			},
		},

		// ──────────────────────────── Encryption ────────────────────────────
		encryption_enabled: {
			name: 'Encryption Enabled',
			type: 'boolean',
			description: 'Change style when encryption is active',
			defaultStyle: {
				bgcolor: combineRgb(0, 128, 255),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.api.device.encryption === 'ON'
			},
		},

		// ──────────────────────────── Audio Summing Mode ────────────────────────────
		audio_summing_mode: {
			name: 'Audio Summing Mode',
			type: 'boolean',
			description: 'Change style when summing mode matches',
			defaultStyle: {
				bgcolor: combineRgb(0, 128, 255),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					choices: Choices.AudioSummingMode,
					default: 'OFF',
				},
			],
			callback: ({ options }) => {
				return self.api.device.audio_summing_mode === options.mode
			},
		},

		// ──────────────────────────── Input Meter Mode ────────────────────────────
		input_meter_mode: {
			name: 'Input Meter Mode',
			type: 'boolean',
			description: 'Change style when meter mode matches',
			defaultStyle: {
				bgcolor: combineRgb(0, 128, 255),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					choices: Choices.InputMeterMode,
					default: 'PRE_FADER',
				},
			],
			callback: ({ options }) => {
				return self.api.device.input_meter_mode === options.mode
			},
		},

		// ──────────────────────────── Active Preset ────────────────────────────
		active_preset: {
			name: 'Active Preset',
			type: 'boolean',
			description: 'Change style when selected preset is active',
			defaultStyle: {
				bgcolor: combineRgb(0, 204, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'preset',
					type: 'dropdown',
					label: 'Preset',
					choices: Choices.Presets,
					default: '1',
				},
			],
			callback: ({ options }) => {
				return self.api.device.preset === options.preset.padStart(2, '0')
			},
		},
		// ──────────────────────────── Any Channel Muted ────────────────────────────
		any_muted: {
			name: 'Any Channel Muted',
			type: 'boolean',
			description: 'Change style when any channel is muted',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.api.channels.some((ch) => ch.audio_mute === 'ON')
			},
		},

		// ──────────────────────────── Channel LED In State ────────────────────────────
		chan_led_in_state: {
			name: 'Mic Logic LED In',
			type: 'boolean',
			description: 'Change style when mic logic LED in is active',
			defaultStyle: {
				bgcolor: combineRgb(0, 204, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: Choices.ChannelsOnly,
					default: '1',
				},
			],
			callback: ({ options }) => {
				const ch = self.api.getChannel(options.channel)
				return ch ? ch.chan_led_in_state === 'ON' : false
			},
		},
	})
}
