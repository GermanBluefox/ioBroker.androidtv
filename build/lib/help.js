"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var help_exports = {};
__export(help_exports, {
  COMMANDS: () => COMMANDS,
  HELP: () => HELP
});
module.exports = __toCommonJS(help_exports);
const COMMANDS = [
  { command: "help", write: false },
  { command: "getApps", write: false, standard: "tv.getApps" },
  { command: "launchApp", write: true, standard: "tv.launchApp" },
  { command: "remote", write: true, standard: "tv.remote" },
  { command: "power", write: true, standard: "tv.power" },
  { command: "dm:instanceInfo", write: false },
  { command: "dm:loadDevices", write: false },
  { command: "dm:deviceInfo", write: false },
  { command: "dm:deviceStatus", write: false },
  { command: "dm:deviceDetails", write: false },
  { command: "dm:instanceAction", write: true },
  { command: "dm:deviceAction", write: true },
  { command: "dm:deviceControl", write: true },
  { command: "dm:deviceControlState", write: false },
  { command: "dm:deviceLoadProgress", write: false },
  { command: "dm:actionProgress", write: true }
];
const HELP = `ioBroker.androidtv: controls NVIDIA SHIELD, Android TV / Google TV and Amazon Fire TV devices:
on/off, starting apps, remote keys, typing text, mute, and shows the running app and (with ADB) what is playing.
The states of a device do everything; the commands getApps, launchApp, remote and power follow the shared catalog of
ioBroker (family tv) and answer whether it worked.

Commands (sendTo androidtv.0; device = the name or ID of a TV, may be left out if there is only one;
errors answer {error, reason}: NOT_FOUND or AMBIGUOUS with candidates, NOT_CONNECTED, BAD_REQUEST):
- help: this text.
- getApps {}: the app favorites of the settings: {apps: [{id, name}]}.
- launchApp {app, device?}: starts an app: the name of an app favorite, a web link or an app ID (see launchApp
  below) -> {ok, device: {id, name}, app}.
- remote {key, device?}: one key: up, down, left, right, ok, back, home, menu, play, pause, volumeUp, volumeDown,
  mute, channelUp, channelDown, 0-9, the other keys.<id> or a name of sendKey -> {ok, device, key}.
- power {on, device?}: true / false like the state power; answers when the TV reports it ({ok, device, on}) or after
  15 s with pending: true.
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  COMMANDS,
  HELP
});
//# sourceMappingURL=help.js.map
