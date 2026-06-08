export function updateVariableDefinitions(self) {
	const variables = []

	// Device-level variables
	variables.push(
		{ variableId: 'device_model', name: 'Model' },
		{ variableId: 'device_serial', name: 'Serial Number' },
		{ variableId: 'device_firmware', name: 'Firmware Version' },
		{ variableId: 'device_id', name: 'Device ID' },
		{ variableId: 'device_mgmt_ip', name: 'Management IP Address (the Target IP you connect to)' },
		{ variableId: 'device_ip', name: 'Dante (Audio) IP Address — not the management/Target IP' },
		{ variableId: 'device_subnet', name: 'Dante (Audio) Subnet' },
		{ variableId: 'device_gateway', name: 'Dante (Audio) Gateway' },
		{ variableId: 'device_mac', name: 'MAC Address' },
		{ variableId: 'dante_name', name: 'Dante Device Name' },
		{ variableId: 'active_preset', name: 'Active Preset Number' },
		{ variableId: 'led_brightness', name: 'LED Brightness' },
		{ variableId: 'encryption', name: 'Encryption Status' },
		{ variableId: 'summing_mode', name: 'Audio Summing Mode' },
		{ variableId: 'meter_mode', name: 'Input Meter Mode' },
	)

	// Preset names
	for (let p = 1; p <= 10; p++) {
		variables.push({ variableId: `preset_${p}_name`, name: `Preset ${p} Name` })
	}

	// Per-channel variables
	for (let ch = 1; ch <= 4; ch++) {
		variables.push(
			{ variableId: `ch${ch}_name`, name: `Channel ${ch} Name` },
			{ variableId: `ch${ch}_dante_name`, name: `Channel ${ch} Dante Name` },
			{ variableId: `ch${ch}_analog_gain`, name: `Channel ${ch} Analog Gain (dB)` },
			{ variableId: `ch${ch}_digital_gain`, name: `Channel ${ch} Digital Gain (dB)` },
			{ variableId: `ch${ch}_mute`, name: `Channel ${ch} Mute` },
			{ variableId: `ch${ch}_phantom`, name: `Channel ${ch} Phantom Power` },
			{ variableId: `ch${ch}_sig_clip`, name: `Channel ${ch} Sig/Clip Color` },
			{ variableId: `ch${ch}_clip_indicator`, name: `Channel ${ch} Clip Indicator` },
			{ variableId: `ch${ch}_gating`, name: `Channel ${ch} Gating Logic` },
			{ variableId: `ch${ch}_led_in`, name: `Channel ${ch} LED In State` },
			{ variableId: `ch${ch}_limiter`, name: `Channel ${ch} Limiter` },
			{ variableId: `ch${ch}_meter_level`, name: `Channel ${ch} Meter Level` },
			{ variableId: `ch${ch}_rms_level`, name: `Channel ${ch} RMS Level` },
			{ variableId: `ch${ch}_peak_level`, name: `Channel ${ch} Peak Level` },
		)
	}

	self.setVariableDefinitions(variables)
}

export function getVariableValues(self) {
	const api = self.api
	const d = api.device
	const values = {}

	// Device-level
	values['device_model'] = d.model.trim()
	values['device_serial'] = d.serial_num.trim()
	values['device_firmware'] = d.fw_ver.trim()
	values['device_id'] = d.device_id.trim()
	values['device_mgmt_ip'] = self.config && self.config.host ? self.config.host : ''
	values['device_ip'] = d.ip_address.trim()
	values['device_subnet'] = d.subnet.trim()
	values['device_gateway'] = d.gateway.trim()
	values['device_mac'] = d.mac_address.trim()
	values['dante_name'] = d.na_device_name.trim()
	values['active_preset'] = d.preset
	values['led_brightness'] = ['Disabled', 'Dim', 'Default'][parseInt(d.led_brightness, 10)] || d.led_brightness
	values['encryption'] = d.encryption
	values['summing_mode'] = d.audio_summing_mode
	values['meter_mode'] = d.input_meter_mode === 'PRE_FADER' ? 'Pre-Fader' : 'Post-Fader'

	// Preset names
	for (let p = 0; p < 10; p++) {
		values[`preset_${p + 1}_name`] = api.presetNames[p].trim()
	}

	// Per-channel
	for (let i = 0; i < 4; i++) {
		const ch = api.channels[i]
		const n = i + 1
		values[`ch${n}_name`] = ch.name.trim()
		values[`ch${n}_dante_name`] = ch.na_chan_name.trim()

		// Convert analog gain value to dB display (value * 3)
		const analogGain = parseInt(ch.audio_gain, 10)
		values[`ch${n}_analog_gain`] = isNaN(analogGain) ? ch.audio_gain : `${analogGain} dB`

		// Convert hi-res gain to dB (value / 10)
		const digitalGain = parseInt(ch.audio_gain_hi_res, 10)
		values[`ch${n}_digital_gain`] = isNaN(digitalGain) ? ch.audio_gain_hi_res : `${(digitalGain / 10).toFixed(1)} dB`

		values[`ch${n}_mute`] = ch.audio_mute
		values[`ch${n}_phantom`] = ch.phantom_pwr
		values[`ch${n}_sig_clip`] = ch.led_color_sig_clip
		values[`ch${n}_clip_indicator`] = ch.audio_clip_indicator
		values[`ch${n}_gating`] = ch.hw_gating_logic
		values[`ch${n}_led_in`] = ch.chan_led_in_state
		values[`ch${n}_limiter`] = ch.limiter_engaged

		// Meter level from SAMPLE data
		values[`ch${n}_meter_level`] = ch.meter_level

		// RMS and Peak from GET commands
		const rms = parseInt(ch.audio_in_rms_lvl, 10)
		values[`ch${n}_rms_level`] = isNaN(rms) ? '---' : `-${rms} dB`
		const peak = parseInt(ch.audio_in_peak_lvl, 10)
		values[`ch${n}_peak_level`] = isNaN(peak) ? '---' : `-${peak} dB`
	}

	return values
}
