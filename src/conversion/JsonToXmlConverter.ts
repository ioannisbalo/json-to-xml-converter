import { RecursiveConverter } from './RecursiveConverter';
import { XmlBuilder } from '../xml/XmlBuilder';
import { JsonToXmlConverterInterface } from '../interfaces/JsonToXmlConverterInterface';
import { KeyValueInterface } from '../interfaces/KeyValueInterface';
import { JsonToXmlMapInterface } from '..';

export class JsonToXmlConverter implements JsonToXmlConverterInterface {
  private readonly recursiveConverter: RecursiveConverter;

  public constructor(map: JsonToXmlMapInterface) {
    const xmlBuilder = new XmlBuilder();
    this.recursiveConverter = new RecursiveConverter(xmlBuilder, map);
  }

  public convert(jsonInput: KeyValueInterface<any>): string {
    return this.recursiveConverter.convert(jsonInput);
  }
}
