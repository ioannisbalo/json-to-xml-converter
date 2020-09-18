export class EntsoeBoolean {
  public value: string;

  public constructor(booleanInput: boolean) {
    this.value = booleanInput ? 'A01' : 'A02';
  }
}
