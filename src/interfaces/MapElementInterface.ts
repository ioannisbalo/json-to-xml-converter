import { MapAttributesInterface } from './MapAttributesInterface';
import { JsonToXmlMapInterface } from './JsonToXmlMapInterface';
import { MapElementTypeEnum } from '../enums/MapElementEnum';
import { NodeTypeEnum } from '../../../cbp/nl-afrr-activated-energy-forwarding/server/src/core/activated-energy/enums/NodeTypeEnum';

export interface MapElementInterface {
  xmlNodeName: string;
  type: MapElementTypeEnum;
  attributes?: MapAttributesInterface[];
  body?: JsonToXmlMapInterface;
  nodeType?: NodeTypeEnum;
}
