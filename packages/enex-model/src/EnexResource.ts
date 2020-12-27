export class EnexResource {
  constructor(
    readonly hash: string,
    readonly mime: string,
    readonly base64: string,
    readonly meta: {
      width?: number;
      height?: number;
    }
  ) {}

  toDataUrl() {
    return `data:${this.mime};base64,${this.base64}`;
  }
}
