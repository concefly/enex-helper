import { XmlCDataNode, XmlHelper, XmlTextNode } from 'ah-xml';
import { EnexContent } from './EnexContent';
import { EnexResource } from './EnexResource';

export function parseNote(raw: string) {
  const xh = new XmlHelper(raw);

  return xh.query('note').map(noteNode => {
    const title = (noteNode.query('> title')[0].flatChildren[0] as XmlTextNode).text + '';

    const contentCdata = (noteNode.query('> content')[0].flatChildren[0] as XmlCDataNode).cdata;
    const contentXH = new XmlHelper(contentCdata);
    const contentNoteRoot = contentXH.query('> en-note')[0];

    const content = new EnexContent(contentNoteRoot);

    const resources = noteNode.query('resource').map(res => {
      const base64 = ((res.query('> data')[0].flatChildren[0] as XmlTextNode).text + '').replace(
        /\n/g,
        ''
      );
      const mime = (res.query('> mime')[0].flatChildren[0] as XmlTextNode).text + '';

      const recognitionCDATA = (res.query('> recognition')[0].flatChildren[0] as XmlCDataNode)
        .cdata;
      const recognitionXH = new XmlHelper(recognitionCDATA);

      const recoIndex = recognitionXH.query('> recoIndex')[0];
      const hash = recoIndex.attributes.get('objID')!;

      return new EnexResource(hash, mime, base64, {
        width: +recoIndex.attributes.get('objWidth')!,
        height: +recoIndex.attributes.get('objHeight')!,
      });
    });

    const note = new EnexNote(title, content, { resources });
    return note;
  });
}

export class EnexNote {
  constructor(
    public title: string,
    public content: EnexContent,
    public meta?: {
      resources?: EnexResource[];
    }
  ) {}

  getResourceByHash(hash: string) {
    return this.meta?.resources?.find(r => r.hash === hash);
  }
}
