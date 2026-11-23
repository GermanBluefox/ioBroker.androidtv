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
var standard_exports = {};
__export(standard_exports, {
  isCatalogError: () => isCatalogError,
  launchTargetOf: () => launchTargetOf,
  pick: () => pick,
  reasonOf: () => reasonOf,
  remoteKeyOf: () => remoteKeyOf
});
module.exports = __toCommonJS(standard_exports);
var import_states = require("./states");
var import_remote = require("./remote");
function pick(things, wanted, what) {
  const candidates = things.map((t) => t.name);
  const text = typeof wanted === "string" || typeof wanted === "number" ? String(wanted).trim().toLowerCase() : "";
  if (!text) {
    if (things.length === 1) {
      return things[0];
    }
    return things.length ? { error: `Which ${what}?`, reason: "AMBIGUOUS", candidates } : { error: `No ${what} configured`, reason: "NOT_FOUND", candidates };
  }
  const exact = things.filter((t) => t.id.toLowerCase() === text || t.name.toLowerCase() === text);
  const found = exact.length ? exact : things.filter((t) => t.name.toLowerCase().includes(text));
  if (found.length === 1) {
    return found[0];
  }
  return found.length ? { error: `Several ${what}s fit "${String(wanted)}"`, reason: "AMBIGUOUS", candidates: found.map((t) => t.name) } : { error: `Unknown ${what} "${String(wanted)}"`, reason: "NOT_FOUND", candidates };
}
function isCatalogError(value) {
  return !!value && typeof value === "object" && "error" in value;
}
function launchTargetOf(apps, app) {
  if (typeof app !== "string" || !app.trim()) {
    return { error: 'Missing "app"', reason: "BAD_REQUEST" };
  }
  const favorite = pick(apps, app, "app");
  if (!isCatalogError(favorite)) {
    return favorite.link;
  }
  const target = app.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || /^[a-z]\w*(\.\w+)+$/i.test(target)) {
    return target;
  }
  return favorite;
}
const CATALOG_KEYS = { mute: "VOLUME_MUTE" };
function remoteKeyOf(key) {
  if (typeof key !== "string" && typeof key !== "number") {
    return void 0;
  }
  const text = String(key).trim();
  if (/^\d$/.test(text)) {
    return `KEYCODE_${text}`;
  }
  const button = import_states.KEY_BUTTONS.find((b) => b.id.toLowerCase() === text.toLowerCase());
  if (button) {
    return button.key;
  }
  if (CATALOG_KEYS[text.toLowerCase()]) {
    return CATALOG_KEYS[text.toLowerCase()];
  }
  return (0, import_remote.resolveKeyCode)(text) === void 0 ? void 0 : text;
}
function reasonOf(message) {
  return /not connected|not reachable/i.test(message) ? "NOT_CONNECTED" : void 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isCatalogError,
  launchTargetOf,
  pick,
  reasonOf,
  remoteKeyOf
});
//# sourceMappingURL=standard.js.map
