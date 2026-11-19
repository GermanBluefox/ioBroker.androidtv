/**
 * The answer of the message `help`: what the instance answers and how the devices are controlled, written for AI
 * agents (e.g. ioBroker.pi-agent, or the MCP server with `send_to`) and script authors. Keep it in sync with
 * `onMessage` and `handleCommand` in main.ts, the states in states.ts and the README.
 */

/** A command the instance answers; `write` = it has an effect */
export interface HelpCommand {
    /** Name of the command */
    command: string;
    /** The command changes something (device, configuration) */
    write: boolean;
}

/** Every command the instance answers: `help` in main.ts, the `dm:*` commands by the Device Manager (dm-utils) */
export const COMMANDS: HelpCommand[] = [
    { command: 'help', write: false },
    { command: 'dm:instanceInfo', write: false },
    { command: 'dm:loadDevices', write: false },
    { command: 'dm:deviceInfo', write: false },
    { command: 'dm:deviceStatus', write: false },
    { command: 'dm:deviceDetails', write: false },
    { command: 'dm:instanceAction', write: true },
    { command: 'dm:deviceAction', write: true },
    { command: 'dm:deviceControl', write: true },
    { command: 'dm:deviceControlState', write: false },
    { command: 'dm:deviceLoadProgress', write: false },
    { command: 'dm:actionProgress', write: true },
];

export const HELP = `ioBroker.androidtv: controls NVIDIA SHIELD, Android TV / Google TV and Amazon Fire TV devices:
on/off, starting apps, remote keys, typing text, mute, and shows the running app and (with ADB) what is playing.
Everything is done by writing the states of a device; there are no commands for that.

Commands (sendTo androidtv.0):
- help: this text.
- dm:instanceInfo, dm:loadDevices, dm:deviceInfo, dm:deviceStatus, dm:deviceDetails, dm:instanceAction,
  dm:deviceAction, dm:deviceControl, dm:deviceControlState, dm:deviceLoadProgress, dm:actionProgress: the
  Device Manager of admin (adding, pairing, removing devices), for the settings, not for agents.

States (androidtv.0.<device>.*): one device object per TV, its name is the name of the TV in the settings.
Write the states with ack false.
- power: true switches on, false off (screen on/off); read: is it on. From deep standby only by Wake-on-LAN
  (needs the MAC address in the settings).
- launchApp: starts an app: a web link (https://www.netflix.com/title, https://www.youtube.com) or an app ID
  (package, e.g. com.netflix.ninja; needs ADB: Fire TV or the type "with title and play/pause").
  apps.<name>: buttons for the app favorites of the settings (write true).
- sendKey: one key: a name of android.view.KeyEvent without KEYCODE_ (case-insensitive), e.g. HOME, BACK,
  DPAD_UP, DPAD_DOWN, DPAD_LEFT, DPAD_RIGHT, DPAD_CENTER (ok), MEDIA_PLAY_PAUSE, VOLUME_UP, VOLUME_DOWN,
  VOLUME_MUTE, POWER, or a numeric key code. keys.<id>: buttons (write true) home, back, menu, settings, up,
  down, left, right, ok, playPause, play, pause, stop, next, previous, fastForward, rewind, volumeUp, volumeDown,
  channelUp, channelDown, search, info.
- sendText: types the text into the input field that has the focus (e.g. a search field).
- muted: true / false mutes (not on devices with ADB only). The volume cannot be set: one step per
  keys.volumeUp / keys.volumeDown.
- To read: currentAppName (e.g. Netflix, empty while off), currentApp (app ID), volume and volumeMax (null when
  the TV or receiver controls it), info.connected, info.status (text), info.pairingRequired; with ADB:
  media.state (play, pause, stop, buffering, idle), media.title, media.subtitle, media.app, media.position
  (seconds).

How to talk to the user:
- Which TV comes only from the user's request (its name or room). If there are several devices and the request
  names none, ask which one; do not guess and do not reuse the one of an earlier request. Name the devices by
  their name, not by ID.
- Switching on/off, starting apps and keys act at once on the TV someone may be watching: only on the user's
  request. Before typing a text, make sure an input field is open (e.g. after search).
- info.connected false: the TV is off or unreachable (info.status says why); only power true can wake it
  (Wake-on-LAN), tell the user instead of sending keys. info.pairingRequired: pair it again in the settings.`;
