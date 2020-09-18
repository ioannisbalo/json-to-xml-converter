export class TypeNotSupportedError extends Error {
  public readonly status: number = 422;

  public constructor(type: string) {
    super();
    this.message = `Type ${type} is not supported.`;
  }
}
