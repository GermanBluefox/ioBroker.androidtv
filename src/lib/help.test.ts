import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { COMMANDS, HELP } from './help';

/** The commands answered by the instance: `help` in main.ts, `dm:*` by the Device Manager of dm-utils */
function answeredCommands(): string[] {
    const main = readFileSync(join(__dirname, '..', 'main.ts'), 'utf8');
    const own = [...main.matchAll(/obj\?\.command === '([^']+)'/g)].map(m => m[1]);
    const dm = readFileSync(require.resolve('@iobroker/dm-utils/build/DeviceManagement.js'), 'utf8');
    const dmCommands = [...dm.matchAll(/case '(dm:[^']+)':/g)].map(m => m[1]);
    return [...own, ...dmCommands];
}

describe('help', () => {
    it('lists every command the instance answers, each once', () => {
        const names = COMMANDS.map(c => c.command);
        expect(new Set(names).size).to.equal(names.length);
        expect([...names].sort()).to.deep.equal(answeredCommands().sort());
    });

    it('marks the commands that change something as writing', () => {
        expect(COMMANDS.filter(c => c.write).map(c => c.command)).to.deep.equal([
            'dm:instanceAction',
            'dm:deviceAction',
            'dm:deviceControl',
            'dm:actionProgress',
        ]);
    });

    it('names every command and the states an agent needs', () => {
        for (const word of [
            ...COMMANDS.map(c => c.command),
            'sendTo androidtv.0',
            'power',
            'launchApp',
            'sendKey',
            'sendText',
            'muted',
            'keys.volumeUp',
            'currentAppName',
            'How to talk to the user:',
            'ask which one',
        ]) {
            expect(HELP, word).to.include(word);
        }
    });

    it('keeps the lines short', () => {
        for (const line of HELP.split('\n')) {
            expect(line.length, line).to.be.at.most(120);
        }
    });
});
