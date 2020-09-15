import { MapAttributesInterface } from './MapAttributesInterface';
import { JsonToXmlMapInterface } from './JsonToXmlMapInterface';
import { MapElementTypeEnum } from '../enums/MapElementEnum';

export interface MapElementInterface {
  xmlNodeName: string;
  type: MapElementTypeEnum;
  attributes: MapAttributesInterface[];
  body: JsonToXmlMapInterface;
}
