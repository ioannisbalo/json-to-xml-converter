import { InvalidAttributeError } from '../errors/InvalidAttributeError';
import { KeyValueInterface } from '../interfaces/KeyValueInterface';
import { MapAttributesInterface } from '../interfaces/MapAttributesInterface';
import { XmlBuilderInterface } from '../interfaces/XmlBuilderInterface';
import { begin, XMLElementOrXMLNode } from 'xmlbuilder';

export class XmlBuilder implements XmlBuilderInterface {
  public beginXmlDocument(
    name: string,
    attributes: KeyValueInterface<string>
  ): XMLElementOrXMLNode {
    return this.addNode(begin(), name, attributes);
  }

  public endXmlDocument(xmlElement: XMLElementOrXMLNode, pretty: boolean): string {
    return xmlElement.end({ pretty });
  }

  public addNode(
    xmlElement: XMLElementOrXMLNode,
    name: string,
    attributes?: KeyValueInterface<string>,
    text?: string | number
  ): XMLElementOrXMLNode {
    return xmlElement.element(`${name}`, attributes, text);
  }

  public addNodesArray(
    xmlElement: XMLElementOrXMLNode,
    array: KeyValueInterface<any>[]
  ): XMLElementOrXMLNode[] {
    return array.map((item) => {
      return this.addNode(xmlElement, item.xmlNodeName, item.attributes, item.text);
    });
  }

  public updateAttributes(
    attributes: MapAttributesInterface[],
    jsonInput: KeyValueInterface<any>
  ): KeyValueInterface<string> {
    const updatedAttributes: MapAttributesInterface[] = attributes.map(
      (attribute: MapAttributesInterface) => {
        const attributeValue = attribute.value ? attribute.value : jsonInput[attribute.source];

        if (!attributeValue) {
          throw new InvalidAttributeError(attribute.name);
        }

        return {
          ...attribute,
          value: attributeValue
        };
      }
    );

    return this.getAttributeNameAndValue(updatedAttributes);
  }

  private getAttributeNameAndValue(
    attributes: MapAttributesInterface[]
  ): KeyValueInterface<string> {
    return attributes.reduce(
      (object: KeyValueInterface<string>, attribute: MapAttributesInterface) => {
        object[attribute.name] = attribute.value;

        return object;
      },
      {}
    );
  }
}
