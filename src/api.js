import { TCPHelper, InstanceStatus } from '@companion-module/base'

export class Ani4inApi {
	constructor(instance) {
		this.instance = instance
		this.socket = null
		this.pollTimer = null
		this.heartbeatTimer = null
		this.heartbeatTimeout = null
		this.incomingData = ''

		this.device = {
			model: '',
			serial_num: '',
			fw_ver: '',
			device_id: '',
			ip_address: '',
			subnet: '',
			gateway: '',
			mac_address: '',
			na_device_name: '',
			preset: '',
			led_brightness: '2',
			encryption: '',
			audio_summing_mode: 'OFF',
			input_meter_mode: 'PRE_FADER',
			flash: 'OFF',
		}

		this.channels = []
		for (let i = 0; i < 4; i++) {
			this.channels.push({
				name: '',
				na_chan_name: '',
				audio_gain: '00',
				audio_gain_hi_res: '0000',
				audio_mute: 'OFF',
				phantom_pwr: 'OFF',
				led_color_sig_clip: 'OFF',
				led_state_sig_clip: 'Off',
				audio_clip_indicator: 'OFF',
				hw_gating_logic: 'OFF',
				chan_led_in_state: 'OFF',
				limiter_engaged: 'OFF',
				audio_in_rms_lvl: '000',
				audio_in_peak_lvl: '000',
				meter_level: 0,
			})
		}

		this.presetNames = Array(10).fill('')
	}

	connect() {
		this.disconnect()

		const config = this.instance.config
		if (!config.host) {
			this.instance.updateStatus(InstanceStatus.BadConfig, 'No IP configured')
			return
		}

		this.instance.updateStatus(InstanceStatus.Connecting)

		this.socket = new TCPHelper(config.host, config.port || 2202)

		this.socket.on('status_change', (status, message) => {
			this.instance.updateStatus(status, message)
		})

		this.socket.on('connect', () => {
			this.instance.updateStatus(InstanceStatus.Ok)
			this.instance.log('info', `Connected to ANI4IN at ${config.host}:${config.port || 2202}`)
			this.queryInitialState()
			this.startPolling()
			this.startHeartbeat()
		})

		this.socket.on('error', (err) => {
			this.instance.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.instance.log('error', `TCP error: ${err.message}`)
			this.stopPolling()
			this.stopHeartbeat()
		})

		this.socket.on('end', () => {
			this.instance.updateStatus(InstanceStatus.Disconnected)
			this.instance.log('info', 'Connection closed')
			this.stopPolling()
			this.stopHeartbeat()
		})

		this.socket.on('data', (data) => {
			this.processIncomingData(data)
		})
	}

	disconnect() {
		this.stopPolling()
		this.stopHeartbeat()
		if (this.socket) {
			this.socket.destroy()
			this.socket = null
		}
		this.incomingData = ''
	}

	sendCommand(cmd) {
		if (this.socket && this.socket.isConnected) {
			const fullCmd = `< ${cmd} >`
			this.instance.log('debug', `TX: ${fullCmd}`)
			this.socket.send(fullCmd + '\r\n')
		}
	}

	queryInitialState() {
		// Query all parameters for all channels
		this.sendCommand('GET 0 ALL')

		// Device-level queries
		this.sendCommand('GET MODEL')
		this.sendCommand('GET SERIAL_NUM')
		this.sendCommand('GET FW_VER')
		this.sendCommand('GET DEVICE_ID')
		this.sendCommand('GET IP_ADDR_NET_AUDIO_PRIMARY')
		this.sendCommand('GET IP_SUBNET_NET_AUDIO_PRIMARY')
		this.sendCommand('GET IP_GATEWAY_NET_AUDIO_PRIMARY')
		this.sendCommand('GET CONTROL_MAC_ADDR')
		this.sendCommand('GET NA_DEVICE_NAME')
		this.sendCommand('GET PRESET')
		this.sendCommand('GET LED_BRIGHTNESS')
		this.sendCommand('GET ENCRYPTION')
		this.sendCommand('GET AUDIO_SUMMING_MODE')
		this.sendCommand('GET INPUT_METER_MODE')

		// Per-channel queries
		for (let ch = 1; ch <= 4; ch++) {
			this.sendCommand(`GET ${ch} CHAN_NAME`)
			this.sendCommand(`GET ${ch} AUDIO_GAIN`)
			this.sendCommand(`GET ${ch} AUDIO_GAIN_HI_RES`)
			this.sendCommand(`GET ${ch} AUDIO_MUTE`)
			this.sendCommand(`GET ${ch} PHANTOM_PWR_ENABLE`)
			this.sendCommand(`GET ${ch} LED_COLOR_SIG_CLIP`)
			this.sendCommand(`GET ${ch} LED_STATE_SIG_CLIP`)
			this.sendCommand(`GET ${ch} AUDIO_OUT_CLIP_INDICATOR`)
			this.sendCommand(`GET ${ch} HW_GATING_LOGIC`)
			this.sendCommand(`GET ${ch} CHAN_LED_IN_STATE`)
		}

		// Dante network channel names (uses xx format per docs)
		this.sendCommand('GET 0 NA_CHAN_NAME')

		// Preset names
		for (let p = 1; p <= 10; p++) {
			this.sendCommand(`GET PRESET${p}`)
		}

		// Start metering if enabled
		if (this.instance.config.metering_enabled) {
			this.sendCommand(`SET METER_RATE ${String(this.instance.config.metering_rate || 500).padStart(5, '0')}`)
		}
	}

	startPolling() {
		this.stopPolling()
		const interval = (this.instance.config.poll_interval || 30) * 1000
		this.pollTimer = setInterval(() => {
			this.sendCommand('GET 0 ALL')
		}, interval)
	}

	stopPolling() {
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}
	}

	startHeartbeat() {
		this.stopHeartbeat()

		// Send a lightweight query every 15 seconds to keep the connection alive
		this.heartbeatTimer = setInterval(() => {
			this.sendCommand('GET PRESET')
		}, 15000)

		// Reset the timeout every time we receive data
		this.resetHeartbeatTimeout()
	}

	stopHeartbeat() {
		if (this.heartbeatTimer) {
			clearInterval(this.heartbeatTimer)
			this.heartbeatTimer = null
		}
		if (this.heartbeatTimeout) {
			clearTimeout(this.heartbeatTimeout)
			this.heartbeatTimeout = null
		}
	}

	resetHeartbeatTimeout() {
		if (this.heartbeatTimeout) {
			clearTimeout(this.heartbeatTimeout)
		}
		// If no data received for 60 seconds, consider connection stale and reconnect
		this.heartbeatTimeout = setTimeout(() => {
			this.instance.log('warn', 'No response from device in 60s, reconnecting...')
			this.instance.updateStatus(InstanceStatus.ConnectionFailure, 'Heartbeat timeout')
			this.connect()
		}, 60000)
	}

	processIncomingData(data) {
		// Any data received means the connection is alive
		this.resetHeartbeatTimeout()

		const str = data.toString('utf8')
		this.instance.log('debug', `RAW RX (${str.length} bytes): ${str.substring(0, 200)}`)

		this.incomingData += str

		// The ANI4IN terminates each message with ">" possibly followed by \r\n
		// Split on ">" to extract complete messages
		const parts = this.incomingData.split('>')
		// Last part is incomplete (no closing >), keep it
		this.incomingData = parts.pop()

		for (const part of parts) {
			const trimmed = part.trim()
			if (trimmed) {
				// Re-add the > that was removed by split
				const message = trimmed + ' >'
				this.instance.log('debug', `RX: ${message}`)
				this.parseResponse(message)
			}
		}
	}

	parseResponse(line) {
		// Handle SAMPLE metering data: < SAMPLE aaa bbb ccc ddd >
		const sampleMatch = line.match(/^< SAMPLE\s+(\d{3})\s+(\d{3})\s+(\d{3})\s+(\d{3})\s+>$/)
		if (sampleMatch) {
			for (let i = 0; i < 4; i++) {
				this.channels[i].meter_level = parseInt(sampleMatch[i + 1], 10)
			}
			this.instance.updateVariablesFromState()
			return
		}

		// Handle REP responses: < REP ... >
		// Use greedy match to capture full payload including padded spaces
		const repMatch = line.match(/^< REP\s+(.*?)\s*>$/)
		if (!repMatch) return

		const payload = repMatch[1]
		this.instance.log('debug', `Parsed REP payload: [${payload}]`)
		this.parseRepPayload(payload)
	}

	// Strip curly braces and extra whitespace from padded string values
	cleanValue(val) {
		return val.replace(/^\{|\}$/g, '').trim()
	}

	parseRepPayload(payload) {
		// Preset names FIRST: PRESET1 ... PRESET10 (must match before bare PRESET nn)
		const presetNameMatch = payload.match(/^PRESET(\d{1,2})\s+(.+)$/)
		if (presetNameMatch) {
			const idx = parseInt(presetNameMatch[1], 10) - 1
			if (idx >= 0 && idx < 10) {
				this.presetNames[idx] = this.cleanValue(presetNameMatch[2])
				this.instance.updateVariablesFromState()
			}
			return
		}

		// Device-level properties (no channel prefix)
		const devicePatterns = [
			{ regex: /^MODEL\s+(.+)$/, key: 'model' },
			{ regex: /^SERIAL_NUM\s+(.+)$/, key: 'serial_num' },
			{ regex: /^FW_VER\s+(.+)$/, key: 'fw_ver' },
			{ regex: /^DEVICE_ID\s+(.+)$/, key: 'device_id' },
			{ regex: /^IP_ADDR_NET_AUDIO_PRIMARY\s+(.+)$/, key: 'ip_address' },
			{ regex: /^IP_SUBNET_NET_AUDIO_PRIMARY\s+(.+)$/, key: 'subnet' },
			{ regex: /^IP_GATEWAY_NET_AUDIO_PRIMARY\s+(.+)$/, key: 'gateway' },
			{ regex: /^CONTROL_MAC_ADDR\s+(.+)$/, key: 'mac_address' },
			{ regex: /^NA_DEVICE_NAME\s+(.+)$/, key: 'na_device_name' },
			{ regex: /^PRESET\s+(\d{1,2})$/, key: 'preset' },
			{ regex: /^LED_BRIGHTNESS\s+(\d)$/, key: 'led_brightness' },
			{ regex: /^ENCRYPTION\s+(ON|OFF)$/, key: 'encryption' },
			{ regex: /^AUDIO_SUMMING_MODE\s+(.+)$/, key: 'audio_summing_mode' },
			{ regex: /^INPUT_METER_MODE\s+(PRE_FADER|POST_FADER)$/, key: 'input_meter_mode' },
			{ regex: /^FLASH\s+(ON|OFF)$/, key: 'flash' },
			{ regex: /^METER_RATE\s+(\d+)$/, key: null },
		]

		for (const { regex, key } of devicePatterns) {
			const m = payload.match(regex)
			if (m) {
				if (key) {
					this.device[key] = this.cleanValue(m[1])
				}
				this.instance.updateVariablesFromState()
				this.instance.checkFeedbacks()
				return
			}
		}

		// Channel-level properties: <channel> <property> <value>
		// Channel number can be 1 or 2 digits (e.g., "1" or "01")
		const channelMatch = payload.match(/^(\d{1,2})\s+(.+)$/)
		if (!channelMatch) return

		const chNum = parseInt(channelMatch[1], 10)
		const rest = channelMatch[2]

		// For channel 0 (all channels), we ignore it since individual channels will report
		if (chNum < 1 || chNum > 4) return

		const ch = this.channels[chNum - 1]

		const channelPatterns = [
			{ regex: /^CHAN_NAME\s+(.+)$/, key: 'name' },
			{ regex: /^NA_CHAN_NAME\s+(.+)$/, key: 'na_chan_name' },
			{ regex: /^AUDIO_GAIN_HI_RES\s+(\d+)$/, key: 'audio_gain_hi_res' },
			{ regex: /^AUDIO_GAIN\s+(\d+)$/, key: 'audio_gain' },
			{ regex: /^AUDIO_MUTE\s+(ON|OFF)$/, key: 'audio_mute' },
			{ regex: /^PHANTOM_PWR_ENABLE\s+(ON|OFF)$/, key: 'phantom_pwr' },
			{ regex: /^LED_COLOR_SIG_CLIP\s+(OFF|GREEN|AMBER|RED)$/, key: 'led_color_sig_clip' },
			{ regex: /^LED_STATE_SIG_CLIP\s+(.+)$/, key: 'led_state_sig_clip' },
			{ regex: /^AUDIO_OUT_CLIP_INDICATOR\s+(ON|OFF)$/, key: 'audio_clip_indicator' },
			{ regex: /^HW_GATING_LOGIC\s+(ON|OFF)$/, key: 'hw_gating_logic' },
			{ regex: /^CHAN_LED_IN_STATE\s+(ON|OFF)$/, key: 'chan_led_in_state' },
			{ regex: /^LIMITER_ENGAGED\s+(ON|OFF)$/, key: 'limiter_engaged' },
			{ regex: /^AUDIO_IN_RMS_LVL\s*(\d{3})$/, key: 'audio_in_rms_lvl' },
			{ regex: /^AUDIO_IN_PEAK_LVL\s*(\d{3})$/, key: 'audio_in_peak_lvl' },
		]

		for (const { regex, key } of channelPatterns) {
			const m = rest.match(regex)
			if (m) {
				ch[key] = this.cleanValue(m[1])
				this.instance.updateVariablesFromState()
				this.instance.checkFeedbacks()
				return
			}
		}

		// If we got here, log unhandled channel response for debugging
		this.instance.log('debug', `Unhandled channel ${chNum} response: ${rest}`)
	}

	getChannel(ch) {
		const idx = parseInt(ch, 10) - 1
		if (idx >= 0 && idx < 4) return this.channels[idx]
		return null
	}
}
