import * as fs from 'fs';
import { parseNote } from '../src';

const xmlRaw = fs.readFileSync('./__test__/fixture.enex', { encoding: 'utf-8' });

describe('index', () => {
  it('normal', () => {
    const notes = parseNote(xmlRaw);
    console.log('@@@', 'notes ->', notes);
  });
});
