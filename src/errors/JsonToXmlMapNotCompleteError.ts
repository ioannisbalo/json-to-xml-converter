export class JsonToXmlMapNotCompleteError extends Error {
  public readonly status: number = 500;

  public constructor() {
    super();
    this.message = `The JsonToXmlMap.json file is not complete`;
  }
}
