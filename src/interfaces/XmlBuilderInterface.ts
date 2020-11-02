import { KeyValueInterface } from './KeyValueInterface';
import { MapAttributesInterface } from './MapAttributesInterface';
import { NodeTypeEnum } from '../enums/NodeTypeEnum';

export interface XmlBuilderInterface {
  beginXmlDocument(name: string, attributes: KeyValueInterface<string>): any;
  endXmlDocument(xmlElement: any, pretty: boolean): string;
  addNode(
    xmlElement: any,
    name: string,
    attributes?: KeyValueInterface<string>,
    text?: string | number,
    nodeType?: NodeTypeEnum
  ): any;
  addNodesArray(xmlElement: any, array: KeyValueInterface<any>[]): any[];
  updateAttributes(
    attributes: MapAttributesInterface[],
    jsonInput: KeyValueInterface<any>
  ): KeyValueInterface<string>;
}
