import 'reflect-metadata';
import { XmlBuilder } from './XmlBuilder';
import { XMLElementOrXMLNode } from 'xmlbuilder';
import { InvalidAttributeError } from '../errors/InvalidAttributeError';

describe('An XmlBuilder', () => {
  const xmlBuilderService: XmlBuilder = new XmlBuilder();
  const rootName = 'TestXML';

  describe('when starting an xml document', () => {
    it('should be successful', () => {
      const xmlElement = xmlBuilderService.beginXmlDocument(rootName, {});

      expect(xmlBuilderService.endXmlDocument(xmlElement, false)).toBe(`<${rootName}/>`);
    });
  });

  describe('when adding', () => {
    let xmlRoot: XMLElementOrXMLNode;

    beforeEach(() => {
      xmlRoot = xmlBuilderService.beginXmlDocument(rootName, {});
    });

    describe('a single xml node', () => {
      const name1 = 'node1';
      const name2 = 'node2';
      const content1 = 'content1';
      const content2 = 'content2';

      it('should be successful if the node is empty and without attributes', () => {
        xmlBuilderService.addNode(xmlRoot, name1);

        expect(xmlBuilderService.endXmlDocument(xmlRoot, false)).toBe(
          `<${rootName}>` + `<${name1}/>` + `</${rootName}>`
        );
      });

      it('should be successful if the node is empty and with attributes', () => {
        const value = 'attr1';
        xmlBuilderService.addNode(xmlRoot, name1, { attr: value });

        expect(xmlBuilderService.endXmlDocument(xmlRoot, false)).toBe(
          `<${rootName}>` + `<${name1} attr="${value}"/>` + `</${rootName}>`
        );
      });

      it('should be successful if the node has text and attributes', () => {
        const value = 'attr1';
        xmlBuilderService.addNode(xmlRoot, name1, { attr: value }, content1);

        expect(xmlBuilderService.endXmlDocument(xmlRoot, false)).toBe(
          `<${rootName}>` + `<${name1} attr="${value}">${content1}</${name1}>` + `</${rootName}>`
        );
      });

      it('should be successful if the node is nested in another node', () => {
        const node1 = xmlBuilderService.addNode(xmlRoot, name1);
        xmlBuilderService.addNode(node1, name2, {}, content1);

        expect(xmlBuilderService.endXmlDocument(xmlRoot, false)).toBe(
          `<${rootName}>` +
            `<${name1}>` +
            `<${name2}>${content1}</${name2}>` +
            `</${name1}>` +
            `</${rootName}>`
        );
      });

      it('should be successful if the root already has another node', () => {
        xmlBuilderService.addNode(xmlRoot, name1, {}, content1);
        xmlBuilderService.addNode(xmlRoot, name2, {}, content2);

        expect(xmlBuilderService.endXmlDocument(xmlRoot, false)).toBe(
          `<${rootName}>` +
            `<${name1}>${content1}</${name1}>` +
            `<${name2}>${content2}</${name2}>` +
            `</${rootName}>`
        );
      });
    });

    describe('an array of xml nodes', () => {
      const xmlNodeName = 'arrayNode';
      const inputArray = [{ xmlNodeName }, { xmlNodeName }];

      it('should be successful for two empty nodes', () => {
        xmlBuilderService.addNodesArray(xmlRoot, inputArray);

        expect(xmlBuilderService.endXmlDocument(xmlRoot, false)).toBe(
          `<${rootName}>` + `<${xmlNodeName}/>` + `<${xmlNodeName}/>` + `</${rootName}>`
        );
      });

      it('should be able to add a nested node in one of the returned nodes', () => {
        const nestedName = 'node1';

        const nodesArray = xmlBuilderService.addNodesArray(xmlRoot, inputArray);
        xmlBuilderService.addNode(nodesArray[0], nestedName);

        expect(xmlBuilderService.endXmlDocument(xmlRoot, false)).toBe(
          `<${rootName}>` +
            `<${xmlNodeName}>` +
            `<${nestedName}/>` +
            `</${xmlNodeName}>` +
            `<${xmlNodeName}/>` +
            `</${rootName}>`
        );
      });
    });
  });

  describe('when updating an attribute object', () => {
    const attributeName = 'attribute';
    const attributeValue = 'value';
    const sourcePropertyName = 'inputProperty';

    it('should be successful when value is provided', () => {
      const attributeArray = [
        {
          name: attributeName,
          value: attributeValue
        }
      ];
      const input = {};

      const attributeObject = xmlBuilderService.updateAttributes(attributeArray, input);

      expect(attributeObject).toEqual({ attribute: attributeValue });
    });

    it('should be successful when source is provided and present in the input', () => {
      const attributeArray = [
        {
          name: attributeName,
          source: sourcePropertyName
        }
      ];
      const input = {
        inputProperty: attributeValue
      };

      const attributeObject = xmlBuilderService.updateAttributes(attributeArray, input);

      expect(attributeObject).toEqual({ attribute: attributeValue });
    });

    it('should return an empty object if the attribute array is empty', () => {
      const attributeArray = [];
      const input = {};

      const attributeObject = xmlBuilderService.updateAttributes(attributeArray, input);

      expect(attributeObject).toEqual({});
    });

    it('should throw an error if neither value or source are provided', () => {
      const attributeArray = [{ name: attributeName }];
      const input = {};

      expect(() => xmlBuilderService.updateAttributes(attributeArray, input)).toThrowError(
        `Attribute ${attributeName} needs to have either value or source defined.`
      );
    });

    it('should throw an error if source is provided but not present in the input', () => {
      const attributeArray = [
        {
          name: attributeName,
          source: attributeValue
        }
      ];
      const input = {
        otherInputProperty: attributeValue
      };

      expect(() => xmlBuilderService.updateAttributes(attributeArray, input)).toThrowError(
        new InvalidAttributeError(attributeName)
      );
    });
  });
});
