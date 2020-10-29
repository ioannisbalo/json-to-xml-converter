import { XmlBuilderInterface } from '../interfaces/XmlBuilderInterface';
import { MapProviderInterface } from '../interfaces/MapProviderInterface';
import { KeyValueInterface } from '../interfaces/KeyValueInterface';
import { JsonToXmlMapInterface } from '../interfaces/JsonToXmlMapInterface';
import { JsonToXmlMapNotCompleteError } from '../errors/JsonToXmlMapNotCompleteError';
import { EntsoeBoolean } from '../entities/EntsoeBoolean';
import { IsoDate } from '../entities/IsoDate';
import { MapElementTypeEnum } from '../enums/MapElementEnum';
import { TypeNotSupportedError } from '../errors/TypeNotSupportedError';

export class RecursiveConverter {
  public constructor(
    private readonly xmlBuilder: XmlBuilderInterface,
    private readonly jsonToXmlMap: JsonToXmlMapInterface
  ) {}

  public convert(jsonInput: KeyValueInterface<any>): string {
    this.validateIfJsonToXmlMapIsComplete(this.jsonToXmlMap);

    const rootXml = this.xmlBuilder.beginXmlDocument(
      this.jsonToXmlMap.root.xmlNodeName,
      this.xmlBuilder.updateAttributes(this.jsonToXmlMap.root.attributes, jsonInput)
    );
    this.convertRecursively(rootXml, jsonInput, this.jsonToXmlMap.root.body);

    return this.xmlBuilder.endXmlDocument(rootXml, false);
  }

  private validateIfJsonToXmlMapIsComplete(jsonToXmlMap: JsonToXmlMapInterface): void {
    if (
      !jsonToXmlMap.root ||
      !jsonToXmlMap.root.body ||
      !jsonToXmlMap.root.xmlNodeName ||
      !jsonToXmlMap.root.attributes
    ) {
      throw new JsonToXmlMapNotCompleteError();
    }
  }

  private convertRecursively(
    xmlRoot: any,
    jsonInput: KeyValueInterface<any>,
    jsonToXmlMapBody: JsonToXmlMapInterface
  ): void {
    if (!jsonInput) {
      return;
    }

    Object.keys(jsonToXmlMapBody).forEach((key) => {
      if (jsonInput[key] === undefined || jsonInput[key] === null) {
        return;
      }

      const mapItem = jsonToXmlMapBody[key];
      const jsonItem = jsonInput[key];
      const updatedAttributes = mapItem.attributes
        ? this.xmlBuilder.updateAttributes(mapItem.attributes, jsonInput)
        : {};

      switch (mapItem.type) {
        case MapElementTypeEnum.String:
          this.xmlBuilder.addNode(
            xmlRoot,
            mapItem.xmlNodeName,
            updatedAttributes,
            jsonItem,
            mapItem.nodeType
          );

          break;
        case MapElementTypeEnum.IsoDate:
          this.xmlBuilder.addNode(
            xmlRoot,
            mapItem.xmlNodeName,
            updatedAttributes,
            new IsoDate(mapItem.xmlNodeName, jsonItem).value,
            mapItem.nodeType
          );

          break;
        case MapElementTypeEnum.EntsoeBoolean:
          this.xmlBuilder.addNode(
            xmlRoot,
            mapItem.xmlNodeName,
            updatedAttributes,
            new EntsoeBoolean(jsonItem).value,
            mapItem.nodeType
          );

          break;
        case MapElementTypeEnum.Object:
          const node = this.xmlBuilder.addNode(
            xmlRoot,
            mapItem.xmlNodeName,
            updatedAttributes,
            mapItem.nodeType
          );
          this.convertRecursively(node, jsonItem, mapItem.body);

          break;
        case MapElementTypeEnum.Array:
          const arrayParameter = jsonItem.map(() => mapItem);
          const nodesArray = this.xmlBuilder.addNodesArray(xmlRoot, arrayParameter);
          nodesArray.forEach((nodeArray: any, index: number) => {
            this.convertRecursively(nodeArray, jsonItem[index], mapItem.body);
          });

          break;
        default:
          throw new TypeNotSupportedError(mapItem.type);
      }
    });
  }
}
