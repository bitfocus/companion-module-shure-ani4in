import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'
import { getConfigFields } from './config.js'
import { upgradeScripts } from './upgrades.js'
import { updateActions } from './actions.js'
import { updateFeedbacks } from './feedbacks.js'
import { updateVariableDefinitions, getVariableValues } from './variables.js'
import { updatePresets } from './presets.js'
import { Ani4inApi } from './api.js'

class ShureAni4inInstance extends InstanceBase {
	async init(config) {
		try {
			this.config = config
			this.api = new Ani4inApi(this)

			this.initModule()
			this.api.connect()
		} catch (e) {
			this.log('error', `Failed to initialize: ${e?.message ?? e}`)
			this.updateStatus(InstanceStatus.UnknownError, e?.message ?? 'Initialization failed')
		}
	}

	initModule() {
		updateVariableDefinitions(this)
		updateActions(this)
		updateFeedbacks(this)
		updatePresets(this)
		this.updateVariablesFromState()
	}

	updateVariablesFromState() {
		const values = getVariableValues(this)
		this.setVariableValues(values)
	}

	getConfigFields() {
		return getConfigFields()
	}

	async configUpdated(config) {
		const oldHost = this.config.host
		const oldPort = this.config.port
		const oldMetering = this.config.metering_enabled
		const oldMeteringRate = this.config.metering_rate

		this.config = config

		// Reconnect if connection details changed
		if (config.host !== oldHost || config.port !== oldPort) {
			this.api.connect()
		} else {
			// Update metering if it changed
			if (config.metering_enabled !== oldMetering || config.metering_rate !== oldMeteringRate) {
				if (config.metering_enabled) {
					const rate = String(config.metering_rate || 500).padStart(5, '0')
					this.api.sendCommand(`SET METER_RATE ${rate}`)
				} else {
					this.api.sendCommand('SET METER_RATE 0')
				}
			}
		}
	}

	async destroy() {
		// Stop metering before disconnect
		if (this.api) {
			this.api.sendCommand('SET METER_RATE 0')
			this.api.disconnect()
		}
	}
}

runEntrypoint(ShureAni4inInstance, upgradeScripts)
