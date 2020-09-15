export class InvalidAttributeError extends Error {
  public readonly status: number = 422;

  public constructor(attributeName: string) {
    super();
    this.message = `Attribute ${attributeName} needs to have either value or source defined.`;
  }
}
