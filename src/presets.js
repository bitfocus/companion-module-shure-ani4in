import { combineRgb } from '@companion-module/base'

const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)
const RED = combineRgb(255, 0, 0)
const DARK_RED = combineRgb(153, 0, 0)
const GREEN = combineRgb(0, 204, 0)
const AMBER = combineRgb(255, 191, 0)
const ORANGE = combineRgb(255, 128, 0)
const BLUE = combineRgb(0, 128, 255)
const DARK_BLUE = combineRgb(0, 51, 102)
const PURPLE = combineRgb(102, 0, 153)
const GRAY = combineRgb(128, 128, 128)
const DARK_GRAY = combineRgb(51, 51, 51)
const YELLOW = combineRgb(255, 255, 0)

const V = (name) => `$(shure-ani4in:${name})`

export function updatePresets(self) {
	const presets = {}

	for (let ch = 1; ch <= 4; ch++) {
		// ──────────────── Channel Strip: Name + Gain, color = signal ────────────────
		presets[`strip_ch${ch}`] = {
			type: 'button',
			category: 'Channel Strip',
			name: `Channel ${ch} Strip`,
			style: {
				show_topbar: false,
				text: `${V(`ch${ch}_name`)}\\n${V(`ch${ch}_analog_gain`)}`,
				size: '14',
				color: WHITE,
				bgcolor: DARK_GRAY,
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [
				{
					feedbackId: 'signal_present',
					options: { channel: String(ch) },
					style: { bgcolor: GREEN, color: BLACK },
				},
				{
					feedbackId: 'sig_clip_color',
					options: { channel: String(ch), color: 'AMBER' },
					style: { bgcolor: AMBER, color: BLACK },
				},
				{
					feedbackId: 'sig_clip_color',
					options: { channel: String(ch), color: 'RED' },
					style: { bgcolor: RED, color: WHITE },
				},
				{
					feedbackId: 'audio_mute',
					options: { channel: String(ch) },
					style: { bgcolor: RED, color: WHITE, text: `${V(`ch${ch}_name`)}\\n${V(`ch${ch}_analog_gain`)}\\nMUTED` },
				},
			],
		}

		// ──────────────── Mute Toggle ────────────────
		presets[`mute_toggle_ch${ch}`] = {
			type: 'button',
			category: 'Audio Mute',
			name: `Toggle Mute Ch ${ch}`,
			style: {
				show_topbar: false,
				text: 'Mute',
				size: '18',
				color: WHITE,
				bgcolor: BLACK,
			},
			steps: [
				{
					down: [{ actionId: 'set_audio_mute', options: { channel: String(ch), state: 'TOGGLE' } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'audio_mute',
					options: { channel: String(ch) },
					style: { bgcolor: RED, color: WHITE },
				},
			],
		}

		// ──────────────── Phantom Power Toggle ────────────────
		presets[`phantom_ch${ch}`] = {
			type: 'button',
			category: 'Phantom Power',
			name: `Phantom Power Ch ${ch}`,
			style: {
				show_topbar: false,
				text: `+48V\\nOFF`,
				size: '18',
				color: GRAY,
				bgcolor: BLACK,
			},
			steps: [
				{
					down: [{ actionId: 'toggle_phantom_power', options: { channel: String(ch) } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'phantom_power',
					options: { channel: String(ch) },
					style: { bgcolor: ORANGE, color: BLACK, text: `+48V\\nON` },
				},
			],
		}

		// ──────────────── Gain Up ────────────────
		presets[`gain_up_ch${ch}`] = {
			type: 'button',
			category: 'Gain Control',
			name: `Gain Up Ch ${ch}`,
			style: {
				show_topbar: false,
				text: '+3',
				size: '24',
				color: WHITE,
				bgcolor: DARK_BLUE,
			},
			steps: [
				{
					down: [{ actionId: 'adjust_analog_gain', options: { channel: String(ch), direction: 'INC', amount: 3 } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		// ──────────────── Gain Down ────────────────
		presets[`gain_down_ch${ch}`] = {
			type: 'button',
			category: 'Gain Control',
			name: `Gain Down Ch ${ch}`,
			style: {
				show_topbar: false,
				text: '-3',
				size: '24',
				color: WHITE,
				bgcolor: DARK_BLUE,
			},
			steps: [
				{
					down: [{ actionId: 'adjust_analog_gain', options: { channel: String(ch), direction: 'DEC', amount: 3 } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		// ──────────────── Digital Gain Fine Up (+1 dB) ────────────────
		presets[`dgain_up_ch${ch}`] = {
			type: 'button',
			category: 'Gain Control',
			name: `Digital Gain Up Ch ${ch}`,
			style: {
				show_topbar: false,
				text: '+1',
				size: '24',
				color: WHITE,
				bgcolor: combineRgb(0, 68, 102),
			},
			steps: [
				{
					down: [{ actionId: 'adjust_digital_gain', options: { channel: String(ch), direction: 'INC', amount: 1 } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		// ──────────────── Digital Gain Fine Down (-1 dB) ────────────────
		presets[`dgain_down_ch${ch}`] = {
			type: 'button',
			category: 'Gain Control',
			name: `Digital Gain Down Ch ${ch}`,
			style: {
				show_topbar: false,
				text: '-1',
				size: '24',
				color: WHITE,
				bgcolor: combineRgb(0, 68, 102),
			},
			steps: [
				{
					down: [{ actionId: 'adjust_digital_gain', options: { channel: String(ch), direction: 'DEC', amount: 1 } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		// ──────────────── Clip Indicator ────────────────
		presets[`clip_ch${ch}`] = {
			type: 'button',
			category: 'Signal Monitoring',
			name: `Clip Indicator Ch ${ch}`,
			style: {
				show_topbar: false,
				text: `CH${ch}\\nCLIP`,
				size: 'auto',
				color: GRAY,
				bgcolor: BLACK,
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [
				{
					feedbackId: 'clip_indicator',
					options: { channel: String(ch) },
					style: { bgcolor: RED, color: WHITE },
				},
			],
		}

		// ──────────────── Gating Logic ────────────────
		presets[`gating_ch${ch}`] = {
			type: 'button',
			category: 'Mic Logic',
			name: `Gating Logic Ch ${ch}`,
			style: {
				show_topbar: false,
				text: `CH${ch} GATE`,
				size: 'auto',
				color: GRAY,
				bgcolor: BLACK,
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [
				{
					feedbackId: 'hw_gating_logic',
					options: { channel: String(ch) },
					style: { bgcolor: GREEN, color: BLACK },
				},
			],
		}

		// ──────────────── Mic Logic LED In ────────────────
		presets[`led_in_ch${ch}`] = {
			type: 'button',
			category: 'Mic Logic',
			name: `LED In Ch ${ch}`,
			style: {
				show_topbar: false,
				text: `CH${ch}\\nLED IN\\nOFF`,
				size: 'auto',
				color: GRAY,
				bgcolor: BLACK,
			},
			steps: [
				{
					down: [{ actionId: 'set_chan_led_in_state', options: { channel: String(ch), state: 'ON' } }],
					up: [],
				},
				{
					down: [{ actionId: 'set_chan_led_in_state', options: { channel: String(ch), state: 'OFF' } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'chan_led_in_state',
					options: { channel: String(ch) },
					style: { bgcolor: GREEN, color: BLACK, text: `CH${ch}\\nLED IN\\nON` },
				},
			],
		}

		// ──────────────── Audio Level Display ────────────────
		presets[`level_ch${ch}`] = {
			type: 'button',
			category: 'Signal Monitoring',
			name: `Audio Level Ch ${ch}`,
			style: {
				show_topbar: false,
				text: `CH${ch} LEVEL\\nRMS: ${V(`ch${ch}_rms_level`)}\\nPK: ${V(`ch${ch}_peak_level`)}`,
				size: '7',
				color: WHITE,
				bgcolor: BLACK,
				alignment: 'center:center',
			},
			steps: [
				{
					down: [{ actionId: 'get_audio_levels', options: { channel: String(ch) } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'clip_indicator',
					options: { channel: String(ch) },
					style: { bgcolor: RED },
				},
			],
		}
	}

	// ──────────────── Limiter Indicators (ch 1 & 3 only, summing mode) ────────────────
	for (const ch of [1, 3]) {
		presets[`limiter_ch${ch}`] = {
			type: 'button',
			category: 'Signal Monitoring',
			name: `Limiter Ch ${ch}`,
			style: {
				show_topbar: false,
				text: `CH${ch}\\nLIMITER`,
				size: 'auto',
				color: GRAY,
				bgcolor: BLACK,
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [
				{
					feedbackId: 'limiter_engaged',
					options: { channel: String(ch) },
					style: { bgcolor: YELLOW, color: BLACK, text: `CH${ch}\\nLIMITER\\nACTIVE` },
				},
			],
		}
	}

	// ──────────────────────────── Mute All / Unmute All ────────────────────────────
	presets['mute_all'] = {
		type: 'button',
		category: 'Audio Mute',
		name: 'Mute All Channels',
		style: {
			show_topbar: false,
			text: 'Mute All',
			size: 'auto',
			color: WHITE,
			bgcolor: DARK_GRAY,
		},
		steps: [
			{
				down: [{ actionId: 'mute_all' }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'any_muted',
				options: {},
				style: { bgcolor: RED, color: WHITE },
			},
		],
	}

	presets['unmute_all'] = {
		type: 'button',
		category: 'Audio Mute',
		name: 'Unmute All Channels',
		style: {
			show_topbar: false,
			text: 'Unmute All',
			size: 'auto',
			color: WHITE,
			bgcolor: DARK_GRAY,
		},
		steps: [
			{
				down: [{ actionId: 'unmute_all' }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// ──────────────────────────── Preset Recall Buttons ────────────────────────────
	for (let p = 1; p <= 10; p++) {
		presets[`recall_preset_${p}`] = {
			type: 'button',
			category: 'Presets',
			name: `Recall Preset ${p}`,
			style: {
				show_topbar: false,
				text: `P${p}\\n${V(`preset_${p}_name`)}`,
				size: 'auto',
				color: WHITE,
				bgcolor: DARK_GRAY,
			},
			steps: [
				{
					down: [{ actionId: 'recall_preset', options: { preset: String(p) } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'active_preset',
					options: { preset: String(p) },
					style: { bgcolor: GREEN, color: BLACK },
				},
			],
		}
	}

	// ──────────────────────────── Device Controls ────────────────────────────
	presets['flash_identify'] = {
		type: 'button',
		category: 'Device',
		name: 'Flash LEDs (Identify)',
		style: {
			show_topbar: false,
			text: 'Identify',
			size: 'auto',
			color: WHITE,
			bgcolor: PURPLE,
		},
		steps: [
			{
				down: [{ actionId: 'set_flash', options: { state: 'ON' } }],
				up: [],
			},
			{
				down: [{ actionId: 'set_flash', options: { state: 'OFF' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['device_info'] = {
		type: 'button',
		category: 'Device',
		name: 'Device Info',
		style: {
			show_topbar: false,
			text: `${V('dante_name')}\\n${V('device_ip')}\\nFW: ${V('device_firmware')}`,
			size: 'auto',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [{ down: [], up: [] }],
		feedbacks: [],
	}

	presets['device_name'] = {
		type: 'button',
		category: 'Device',
		name: 'Device Name',
		style: {
			show_topbar: false,
			text: V('dante_name'),
			size: 'auto',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [{ down: [], up: [] }],
		feedbacks: [],
	}

	presets['device_ip'] = {
		type: 'button',
		category: 'Device',
		name: 'Device IP',
		style: {
			show_topbar: false,
			text: V('device_ip'),
			size: 'auto',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [{ down: [], up: [] }],
		feedbacks: [],
	}

	presets['encryption_status'] = {
		type: 'button',
		category: 'Device',
		name: 'Encryption Status',
		style: {
			show_topbar: false,
			text: `Encrypt\\n${V('encryption')}`,
			size: 'auto',
			color: GRAY,
			bgcolor: BLACK,
		},
		steps: [{ down: [], up: [] }],
		feedbacks: [
			{
				feedbackId: 'encryption_enabled',
				options: {},
				style: { bgcolor: BLUE, color: WHITE },
			},
		],
	}

	presets['reboot_device'] = {
		type: 'button',
		category: 'Device',
		name: 'Reboot Device',
		style: {
			show_topbar: false,
			text: 'Reboot',
			size: 'auto',
			color: WHITE,
			bgcolor: DARK_RED,
		},
		steps: [
			{
				down: [{ actionId: 'reboot' }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// ──────────────────────────── LED Brightness ────────────────────────────
	const brightnessLevels = [
		{ id: '0', label: 'LEDs Off' },
		{ id: '1', label: 'LEDs Dim' },
		{ id: '2', label: 'LEDs Full' },
	]
	for (const lvl of brightnessLevels) {
		presets[`led_brightness_${lvl.id}`] = {
			type: 'button',
			category: 'Device',
			name: lvl.label,
			style: {
				show_topbar: false,
				text: lvl.label,
				size: 'auto',
				color: WHITE,
				bgcolor: DARK_GRAY,
			},
			steps: [
				{
					down: [{ actionId: 'set_led_brightness', options: { brightness: lvl.id } }],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	// ──────────────────────────── Meter Mode Toggle ────────────────────────────
	presets['meter_mode_pre'] = {
		type: 'button',
		category: 'Device',
		name: 'Meter Mode: Pre-Fader',
		style: {
			show_topbar: false,
			text: 'Meter\\nPre',
			size: 'auto',
			color: WHITE,
			bgcolor: DARK_GRAY,
		},
		steps: [
			{
				down: [{ actionId: 'set_input_meter_mode', options: { mode: 'PRE_FADER' } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'input_meter_mode',
				options: { mode: 'PRE_FADER' },
				style: { bgcolor: BLUE, color: WHITE },
			},
		],
	}

	presets['meter_mode_post'] = {
		type: 'button',
		category: 'Device',
		name: 'Meter Mode: Post-Fader',
		style: {
			show_topbar: false,
			text: 'Meter\\nPost',
			size: 'auto',
			color: WHITE,
			bgcolor: DARK_GRAY,
		},
		steps: [
			{
				down: [{ actionId: 'set_input_meter_mode', options: { mode: 'POST_FADER' } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'input_meter_mode',
				options: { mode: 'POST_FADER' },
				style: { bgcolor: BLUE, color: WHITE },
			},
		],
	}

	// ──────────────────────────── Audio Summing Modes ────────────────────────────
	const summingModes = [
		{ id: 'OFF', label: 'Off' },
		{ id: '1+2', label: '1+2' },
		{ id: '3+4', label: '3+4' },
		{ id: '1+2/3+4', label: '1+2/3+4' },
		{ id: '1+2+3+4', label: '1+2+3+4' },
	]
	for (const mode of summingModes) {
		presets[`summing_${mode.id}`] = {
			type: 'button',
			category: 'Audio Summing',
			name: `Summing: ${mode.label}`,
			style: {
				show_topbar: false,
				text: `Sum\\n${mode.label}`,
				size: 'auto',
				color: WHITE,
				bgcolor: DARK_GRAY,
			},
			steps: [
				{
					down: [{ actionId: 'set_audio_summing_mode', options: { mode: mode.id } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'audio_summing_mode',
					options: { mode: mode.id },
					style: { bgcolor: BLUE, color: WHITE },
				},
			],
		}
	}

	self.setPresetDefinitions(presets)
}
