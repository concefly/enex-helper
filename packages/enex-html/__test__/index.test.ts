import * as fs from 'fs';
import { parseNote } from 'enex-model';
import { EnexNoteHtml } from '../src';

const xmlRaw = fs.readFileSync('./__test__/fixture.enex', { encoding: 'utf-8' });

describe('index', () => {
  it('normal', () => {
    const notes = parseNote(xmlRaw);

    notes.forEach(note => {
      const noteHtml = new EnexNoteHtml(note);

      expect(noteHtml.toHTML()).toMatchSnapshot(note.title);
    });
  });
});
