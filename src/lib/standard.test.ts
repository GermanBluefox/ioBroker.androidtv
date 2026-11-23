import { expect } from 'chai';
import { isCatalogError, launchTargetOf, pick, reasonOf, remoteKeyOf } from './standard';

const tvs = [
    { id: 'living_room', name: 'Living room' },
    { id: 'bedroom', name: 'Bedroom TV' },
    { id: 'kids', name: 'Kids room' },
];
const apps = [
    { id: 'Netflix', name: 'Netflix', link: 'https://www.netflix.com/title' },
    { id: 'YouTube', name: 'YouTube', link: 'https://www.youtube.com' },
    { id: 'YouTube_Kids', name: 'YouTube Kids', link: 'com.google.android.youtube.tvkids' },
];

describe('standard commands (shared catalog, family tv)', () => {
    it('finds a device by ID or name, exact before partial', () => {
        expect(pick(tvs, 'BEDROOM', 'device')).to.equal(tvs[1]);
        expect(pick(tvs, 'living room', 'device')).to.equal(tvs[0]);
        expect(pick(tvs, 'kids', 'device')).to.equal(tvs[2]);
        expect(pick(tvs, 'bedroom tv', 'device')).to.equal(tvs[1]);
    });

    it('answers AMBIGUOUS and NOT_FOUND with candidates', () => {
        expect(pick(tvs, 'room', 'device')).to.deep.include({
            reason: 'AMBIGUOUS',
            candidates: ['Living room', 'Bedroom TV', 'Kids room'],
        });
        expect(pick(tvs, undefined, 'device')).to.deep.include({ reason: 'AMBIGUOUS' });
        expect(pick(tvs, 'kitchen', 'device')).to.deep.include({
            reason: 'NOT_FOUND',
            candidates: tvs.map(t => t.name),
        });
        expect(pick([], undefined, 'device')).to.deep.include({ reason: 'NOT_FOUND' });
    });

    it('takes the only device when the message names none', () => {
        expect(pick([tvs[0]], '', 'device')).to.equal(tvs[0]);
        expect(isCatalogError(pick([tvs[0]], '', 'device'))).to.equal(false);
    });

    it('starts an app favorite by name, a link or an app ID as it is', () => {
        expect(launchTargetOf(apps, 'netflix')).to.equal('https://www.netflix.com/title');
        expect(launchTargetOf(apps, 'YouTube')).to.equal('https://www.youtube.com');
        expect(launchTargetOf(apps, 'kids')).to.equal('com.google.android.youtube.tvkids');
        expect(launchTargetOf(apps, 'https://www.zdf.de')).to.equal('https://www.zdf.de');
        expect(launchTargetOf(apps, 'org.xbmc.kodi')).to.equal('org.xbmc.kodi');
        expect(launchTargetOf(apps, 'Disney')).to.deep.include({ reason: 'NOT_FOUND' });
        expect(launchTargetOf(apps, '')).to.deep.include({ reason: 'BAD_REQUEST' });
    });

    it('maps the key names of the catalog', () => {
        expect(remoteKeyOf('up')).to.equal('DPAD_UP');
        expect(remoteKeyOf('ok')).to.equal('DPAD_CENTER');
        expect(remoteKeyOf('volumeUp')).to.equal('VOLUME_UP');
        expect(remoteKeyOf('mute')).to.equal('VOLUME_MUTE');
        expect(remoteKeyOf('channelDown')).to.equal('CHANNEL_DOWN');
        expect(remoteKeyOf('play')).to.equal('MEDIA_PLAY');
        expect(remoteKeyOf('5')).to.equal('KEYCODE_5');
        expect(remoteKeyOf(0)).to.equal('KEYCODE_0');
    });

    it('also takes the names of android.view.KeyEvent and key codes', () => {
        expect(remoteKeyOf('DPAD_UP')).to.equal('DPAD_UP');
        expect(remoteKeyOf('KEYCODE_HOME')).to.equal('KEYCODE_HOME');
        expect(remoteKeyOf('26')).to.equal('26');
        expect(remoteKeyOf('nope')).to.equal(undefined);
        expect(remoteKeyOf(undefined)).to.equal(undefined);
    });

    it('gives the reason of a failed command', () => {
        expect(reasonOf('not connected')).to.equal('NOT_CONNECTED');
        expect(reasonOf('Wake-on-LAN could not be sent')).to.equal(undefined);
    });
});
