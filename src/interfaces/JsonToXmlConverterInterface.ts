import { KeyValueInterface } from './KeyValueInterface';
import { JsonToXmlMapInterface } from './JsonToXmlMapInterface';

export interface JsonToXmlConverterInterface {
  convert(jsonInput: KeyValueInterface<any>): any;
}
