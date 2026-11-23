/**
 * The standard commands of the shared catalog (family `tv`): the device, app and key a message names, mapped to what
 * the adapter knows. Pure functions, used by `answerMessage` in main.ts.
 */
import { KEY_BUTTONS } from './states';
import { resolveKeyCode } from './remote';

/** An answer in the form of the catalog: `{error, reason, candidates?}` */
export interface CatalogError {
    /** Text for a human */
    error: string;
    /** Code of the catalog */
    reason: 'NOT_FOUND' | 'AMBIGUOUS' | 'BAD_REQUEST' | 'NOT_CONNECTED' | 'NOT_SUPPORTED' | 'TIMEOUT';
    /** Names that fit or could be meant */
    candidates?: string[];
}

/** Something with an ID and a name: a device or an app favorite */
export interface Named {
    /** ID in the adapter */
    id: string;
    /** Name the user gives it */
    name: string;
}

/**
 * Finds a thing by its ID or name, compared without case: exact before partial. Without a name, the only one.
 *
 * @param things - Devices or app favorites
 * @param wanted - ID or name from the message
 * @param what - "device" or "app", for the error text
 */
export function pick<T extends Named>(things: T[], wanted: unknown, what: string): T | CatalogError {
    const candidates = things.map(t => t.name);
    const text = typeof wanted === 'string' || typeof wanted === 'number' ? String(wanted).trim().toLowerCase() : '';
    if (!text) {
        if (things.length === 1) {
            return things[0];
        }
        return things.length
            ? { error: `Which ${what}?`, reason: 'AMBIGUOUS', candidates }
            : { error: `No ${what} configured`, reason: 'NOT_FOUND', candidates };
    }
    const exact = things.filter(t => t.id.toLowerCase() === text || t.name.toLowerCase() === text);
    const found = exact.length ? exact : things.filter(t => t.name.toLowerCase().includes(text));
    if (found.length === 1) {
        return found[0];
    }
    return found.length
        ? { error: `Several ${what}s fit "${String(wanted)}"`, reason: 'AMBIGUOUS', candidates: found.map(t => t.name) }
        : { error: `Unknown ${what} "${String(wanted)}"`, reason: 'NOT_FOUND', candidates };
}

/**
 * Whether the value is an error answer of `pick`.
 *
 * @param value - Result of `pick`
 */
export function isCatalogError(value: unknown): value is CatalogError {
    return !!value && typeof value === 'object' && 'error' in value;
}

/**
 * The target of `launchApp {app}`: an app favorite of the settings by name, or else a web link or app ID (package).
 *
 * @param apps - App favorites (id, name, link)
 * @param app - Name, link or package from the message
 */
export function launchTargetOf(apps: (Named & { link: string })[], app: unknown): string | CatalogError {
    if (typeof app !== 'string' || !app.trim()) {
        return { error: 'Missing "app"', reason: 'BAD_REQUEST' };
    }
    const favorite = pick(apps, app, 'app');
    if (!isCatalogError(favorite)) {
        return favorite.link;
    }
    const target = app.trim();
    // a link (https://…) or a package name (com.netflix.ninja) is started as it is
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || /^[a-z]\w*(\.\w+)+$/i.test(target)) {
        return target;
    }
    return favorite;
}

/** Keys of the catalog that are not named like a button of the adapter */
const CATALOG_KEYS: Record<string, string> = { mute: 'VOLUME_MUTE' };

/**
 * The Android key of `remote {key}`: the key names of the catalog (`up`, `ok`, `volumeUp`, `0`–`9` …), the buttons of
 * `keys.*` and the names of android.view.KeyEvent (`DPAD_UP`, `KEYCODE_HOME`).
 *
 * @param key - Key from the message
 */
export function remoteKeyOf(key: unknown): string | undefined {
    if (typeof key !== 'string' && typeof key !== 'number') {
        return undefined;
    }
    const text = String(key).trim();
    if (/^\d$/.test(text)) {
        return `KEYCODE_${text}`; // a digit key, not the key code (resolveKeyCode reads "5" as code 5)
    }
    const button = KEY_BUTTONS.find(b => b.id.toLowerCase() === text.toLowerCase());
    if (button) {
        return button.key;
    }
    if (CATALOG_KEYS[text.toLowerCase()]) {
        return CATALOG_KEYS[text.toLowerCase()];
    }
    return resolveKeyCode(text) === undefined ? undefined : text; // a longer number is a key code
}

/**
 * The reason code of an error thrown while sending to the device.
 *
 * @param message - Error text
 */
export function reasonOf(message: string): CatalogError['reason'] | undefined {
    return /not connected|not reachable/i.test(message) ? 'NOT_CONNECTED' : undefined;
}
