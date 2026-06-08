# Shure ANI4IN

This module controls the Shure ANI4IN Audio Network Interface via TCP command strings.

## Configuration

- **Target IP** - The IP address of the ANI4IN on the control network.
- **Port** - TCP port (default: 2202).
- **Enable Metering** - Enables audio level metering from the device.
- **Metering Rate** - How often (in ms) the device sends audio level samples (minimum 100ms).
- **Polling Interval** - How often (in seconds) the module polls for device state updates.

> **Management vs Dante address:** The ANI4IN has two IPs — the **management/control** address (use this as the Target IP; it also serves the web UI) and the **Dante** audio address. They are usually different. The `device_ip` variable reports the **Dante** address, so it will not match your Target IP — that is expected. Find the management address in your router/DHCP table or via the **Shure Web Device Discovery** app (the device must have Web Device Discovery enabled in its web interface).

## Features

### Actions
- Set/toggle audio mute per channel
- Set analog gain (0-51 dB in 3 dB steps)
- Set digital gain (0-140 dB in 0.1 dB steps)
- Increment/decrement analog and digital gain
- Toggle phantom power (+48V) per channel
- Set LED brightness (disabled/dim/default)
- Set audio summing mode
- Set input meter mode (pre/post fader)
- Set channel LED state
- Set device preset (1-10)
- Flash device LEDs for identification
- Set PEQ filter enable/disable
- Reboot device

### Feedbacks
- Audio mute state
- Phantom power state
- Signal/clip LED color
- Audio clip indicator
- Limiter engaged state
- Encryption status
- Hardware gating logic state
- Audio summing mode

### Variables
- Device info (model, serial, firmware, IP, MAC)
- Channel names
- Dante network names
- Gain levels (analog and digital)
- Audio metering levels (RMS and peak)
- Mute states
- Phantom power states
- Preset info
- Encryption status

## Connection

The ANI4IN communicates via TCP on port 2202 using ASCII command strings.
