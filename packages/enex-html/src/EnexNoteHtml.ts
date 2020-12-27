import { EnexNote, XmlNode, XmlElementNode, XmlTextNode } from 'enex-model';
import escape from 'lodash.escape';

export class EnexNoteHtml {
  constructor(readonly note: EnexNote) {}

  toHTML(): string {
    const convertXml2Html = (n: XmlNode): string => {
      if (n instanceof XmlElementNode) {
        const tag = n.tagName;

        const attrStr = Array.from(n.attributes.entries())
          .map(([_n, _v]) => `${_n}="${escape(_v)}"`)
          .join(' ');

        if (tag === 'en-media') {
          const res = this.note.getResourceByHash(n.attributes.get('hash')!)!;
          const width = res.meta.width ? res.meta.width + 'px' : '100%';
          const height = res.meta.height ? res.meta.height + 'px' : '100%';

          return `<object style="width:${width}; height:${height};" data="${res.toDataUrl()}"></object>`;
        }

        const childrenStr = n.flatChildren.map(convertXml2Html).join('\n');
        return `<${tag} ${attrStr}>${childrenStr}</${tag}>`;
      }

      if (n instanceof XmlTextNode) return n.text;

      return '';
    };

    const bodyStr = this.note.content.data.flatChildren.map(convertXml2Html).join('\n');

    return `
<article>
  <h1>${this.note.title}</h1>
  <div>${bodyStr}</div>
</article>
    `;
  }
}
