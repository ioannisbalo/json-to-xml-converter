export class IsoDate {
  public value: string;
  public constructor(xmlNodeName: string, unixTimestampInMilliseconds: number) {
    this.value = this.getIsoString(xmlNodeName, unixTimestampInMilliseconds);
  }

  private getIsoString(xmlNodeName: string, unixTimestampInMilliseconds: number): string {
    const isoStringWithoutMs = new Date(unixTimestampInMilliseconds).toISOString().split('.')[0];
    if (xmlNodeName === 'createdDateTime') {
      return `${isoStringWithoutMs}Z`;
    } else {
      return this.getIsoStringWithoutSeconds(isoStringWithoutMs);
    }
  }

  private getIsoStringWithoutSeconds(isoStringWithoutMs: string): string {
    return `${isoStringWithoutMs.substring(0, isoStringWithoutMs.length - 3)}Z`;
  }
}
