# companion-module-shure-ani4in

A [Bitfocus Companion](https://bitfocus.io/companion) module for controlling and monitoring the **Shure ANI4IN** Audio Network Interface (ANI4IN-XLR and ANI4IN-BLOCK variants).

Communicates via TCP command strings on port 2202.

## Installation

### Option 1: Developer Module (recommended for custom/local use)

1. Create a developer modules folder if you don't already have one:
   ```
   mkdir -p ~/companion-module-dev
   ```

2. Clone or symlink this module into that folder:
   ```
   # Clone
   git clone <repo-url> ~/companion-module-dev/companion-module-shure-ani4in

   # Or symlink from an existing checkout
   ln -s /path/to/ani4in_companion_module ~/companion-module-dev/companion-module-shure-ani4in
   ```

3. Install dependencies:
   ```
   cd ~/companion-module-dev/companion-module-shure-ani4in
   npm install
   ```

4. In Companion, set the **Developer modules path** to your folder:
   - Open the Companion admin UI
   - On the launch screen, set the path to `~/companion-module-dev`
   - Restart Companion

5. Add the module:
   - Go to **Connections**
   - Click **Add connection**
   - Search for **ANI4IN**
   - Enter the device IP address and configure

### Option 2: Package and import

1. Install dependencies and build:
   ```
   npm install
   npx companion-module-build
   ```

2. Import the resulting package file through Companion's **Modules** interface.

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| **Target IP** | IP address of the ANI4IN on the control network | *(required)* |
| **Port** | TCP command string port | `2202` |
| **Enable Metering** | Enable SAMPLE-based audio level metering | `false` |
| **Metering Rate** | Metering sample interval in milliseconds (min 100) | `500` |
| **Polling Interval** | How often to poll for full state refresh (seconds) | `30` |

### Network addresses: management vs Dante

The ANI4IN has **two separate IP addresses**, and they are easy to mix up:

- **Management / control address** — this is the **Target IP** the module connects to, and the address that serves the device's web interface. Command strings use port `2202`.
- **Dante (audio-network) primary address** — the address used for Dante audio. The device reports this via `IP_ADDR_NET_AUDIO_PRIMARY`, surfaced here as the `device_ip` variable.

These are almost always **different addresses** (for example: management `192.168.8.225`, Dante `192.168.8.198`). Configure the module with the **management address** — *not* the Dante address.

> ⚠️ Because of this, the `device_ip`, `device_subnet`, and `device_gateway` variables report the **Dante** side and will **not** match the Target IP you connected to. That is expected.

**Finding the management address:**

- Check your **router / DHCP** lease table, or
- Use the **[Shure Web Device Discovery](https://www.shure.com/en-US/shop/software/web_device_discovery)** application. The ANI4IN must have its **Web Device Discovery** option enabled in the device's web interface for it to appear in the discovery app.

## Features

### Actions

| Action | Description |
|--------|-------------|
| **Set Audio Mute** | Mute, unmute, or toggle per channel or all channels |
| **Mute All Channels** | Mute all 4 channels at once |
| **Unmute All Channels** | Unmute all 4 channels at once |
| **Set Analog Gain** | Set analog gain 0-51 dB in 3 dB steps |
| **Adjust Analog Gain** | Increment or decrement analog gain by a configurable step |
| **Set Digital Gain (Hi-Res)** | Set digital gain 0-140 dB in 0.1 dB steps |
| **Adjust Digital Gain (Hi-Res)** | Increment or decrement digital gain |
| **Set Phantom Power (+48V)** | Enable or disable phantom power per channel |
| **Toggle Phantom Power (+48V)** | Toggle phantom power based on current state |
| **Set LED Brightness** | Disabled, dim, or default |
| **Flash LEDs (Identify)** | Flash device LEDs for identification (auto-off after 30s) |
| **Set Audio Summing Mode** | Off, 1+2, 3+4, 1+2/3+4, or 1+2+3+4 |
| **Set Input Meter Mode** | Pre-fader or post-fader |
| **Set Mic Logic LED In** | Control channel LED input state |
| **Recall Preset** | Load device presets 1-10 |
| **Set PEQ Filter Enable** | Enable or disable parametric EQ filters |
| **Set Metering Rate** | Control SAMPLE data rate |
| **Query Audio Levels** | Request RMS and peak audio levels |
| **Restore Default Settings** | Restore factory defaults |
| **Reboot Device** | Reboot the ANI4IN |

### Feedbacks

| Feedback | Description |
|----------|-------------|
| **Channel Muted** | Red when channel is muted |
| **Any Channel Muted** | Red when any channel is muted |
| **Phantom Power Active** | Orange when +48V is enabled |
| **Signal Present** | Green when signal is detected |
| **Signal/Clip LED Color** | Matches specific signal level (green/amber/red) |
| **Audio Clip Indicator** | Red when audio is clipping |
| **Hardware Gating Logic** | Green when mic logic gate is active |
| **Mic Logic LED In** | Green when LED in state is active |
| **Limiter Engaged** | Yellow when limiter is active (summing mode, ch 1 or 3) |
| **Encryption Enabled** | Blue when encryption is active |
| **Audio Summing Mode** | Blue when selected mode matches |
| **Input Meter Mode** | Blue when selected mode matches |
| **Active Preset** | Green when selected preset is active |

### Variables

#### Device

| Variable | Description |
|----------|-------------|
| `device_model` | Model number |
| `device_serial` | Serial number |
| `device_firmware` | Firmware version |
| `device_id` | Device ID |
| `device_ip` | Dante (audio-network) IP address — **not** the management/Target IP (see [Network addresses](#network-addresses-management-vs-dante)) |
| `device_subnet` | Dante (audio-network) subnet |
| `device_gateway` | Dante (audio-network) gateway |
| `device_mac` | Control network MAC address |
| `dante_name` | Dante device name |
| `active_preset` | Active preset number |
| `led_brightness` | LED brightness level |
| `encryption` | Encryption status |
| `summing_mode` | Audio summing mode |
| `meter_mode` | Input meter mode |

#### Presets

| Variable | Description |
|----------|-------------|
| `preset_1_name` ... `preset_10_name` | Preset names 1-10 |

#### Per Channel (x4)

| Variable | Description |
|----------|-------------|
| `ch1_name` ... `ch4_name` | Channel name |
| `ch1_dante_name` ... `ch4_dante_name` | Dante channel name |
| `ch1_analog_gain` ... `ch4_analog_gain` | Analog gain level |
| `ch1_digital_gain` ... `ch4_digital_gain` | Digital gain level |
| `ch1_mute` ... `ch4_mute` | Mute state |
| `ch1_phantom` ... `ch4_phantom` | Phantom power state |
| `ch1_sig_clip` ... `ch4_sig_clip` | Signal/clip LED color |
| `ch1_clip_indicator` ... `ch4_clip_indicator` | Clip indicator state |
| `ch1_gating` ... `ch4_gating` | Hardware gating logic state |
| `ch1_led_in` ... `ch4_led_in` | Mic logic LED in state |
| `ch1_limiter` ... `ch4_limiter` | Limiter engaged state |
| `ch1_meter_level` ... `ch4_meter_level` | Meter level (from SAMPLE data) |
| `ch1_rms_level` ... `ch4_rms_level` | RMS audio level |
| `ch1_peak_level` ... `ch4_peak_level` | Peak audio level |

### Preset Buttons

The module includes ready-to-use preset buttons organized by category:

- **Channel Strip** - Name + gain with signal-colored background (green/amber/red), turns red when muted; **press to toggle mute**
- **Audio Mute** - Per-channel mute toggles, mute all, unmute all, and toggle mute all
- **Phantom Power** - Per-channel +48V toggles (orange when active)
- **Analog Gain Control** - Analog +3/-3 dB per channel
- **Digital Gain Control** - Digital +1/-1 dB per channel
- **Signal Monitoring** - Clip indicators, audio level displays, limiter indicators
- **Mic Logic** - Gating logic indicators, LED in state controls
- **Presets** - Preset recall buttons 1-10 (green when active)
- **Audio Summing** - Summing mode selectors (blue when active)
- **Device** - Device info, name, IPs (management + Dante), identify, encryption status, LED brightness, meter mode, reboot

## Connection Details

- **Protocol**: TCP (ASCII command strings)
- **Port**: 2202
- **Keepalive**: The module sends a heartbeat query every 15 seconds and will automatically reconnect if no response is received within 60 seconds.
- **Polling**: Full state is refreshed at the configured polling interval (default 30 seconds). The device also sends unsolicited REPORT messages when parameters change.

## Compatibility

- Shure ANI4IN-XLR
- Shure ANI4IN-BLOCK
- Firmware v2.0+ recommended (required for summing mode, PEQ, metering levels, input meter mode, limiter, reboot, and restore defaults)

## License

MIT
