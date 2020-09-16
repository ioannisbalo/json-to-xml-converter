import { RecursiveConverter } from './RecursiveConverter';
import { TypeNotSupportedError } from '../errors/TypeNotSupportedError';
import { KeyValueInterface } from '../interfaces/KeyValueInterface';
import { MapElementTypeEnum } from '../enums/MapElementEnum';
import { XmlBuilder } from '../xml/XmlBuilder';
import { JsonToXmlMapNotCompleteError } from '../errors/JsonToXmlMapNotCompleteError';

class MockXmlElement {}
const mockXmlElement = new MockXmlElement();

const mockBeginXmlDocument = jest.fn().mockImplementation((): MockXmlElement => mockXmlElement);
const mockAddNode = jest.fn().mockImplementation((): MockXmlElement => mockXmlElement);
const mockAddNodesArray = jest
  .fn()
  .mockImplementation(
    (xmlElement: MockXmlElement, array: KeyValueInterface<any>[]): MockXmlElement[] => {
      return array.map(() => mockXmlElement);
    }
  );
const mockUpdateAttributes = jest.fn().mockImplementation(
  (): KeyValueInterface<string> => {
    return {};
  }
);
const mockXmlBuilderService = jest.fn().mockImplementation(() => {
  return {
    beginXmlDocument: mockBeginXmlDocument,
    endXmlDocument: jest.fn(),
    addNode: mockAddNode,
    addNodesArray: mockAddNodesArray,
    updateAttributes: mockUpdateAttributes
  };
});

/* tslint:disable:no-big-function */
describe('A RecursiveConverter', () => {
  const rootXmlNodeName = 'rootNode';
  const stringXmlNodeName = 'stringNode';
  const isoDateXmlNodeName = 'isoDateNode';
  const entsoeBooleanXmlNodeName = 'entsoeBooleanNode';
  const objectXmlNodeName = 'objectNode';
  const arrayXmlNodeName = 'arrayNode';

  const stringTypeProperty = {
    xmlNodeName: stringXmlNodeName,
    attributes: [],
    type: MapElementTypeEnum.String,
    body: {}
  };

  const isoDateProperty = {
    xmlNodeName: isoDateXmlNodeName,
    attributes: [],
    type: MapElementTypeEnum.IsoDate,
    body: {}
  };

  const entsoeBooleanProperty = {
    xmlNodeName: entsoeBooleanXmlNodeName,
    attributes: [],
    type: MapElementTypeEnum.EntsoeBoolean,
    body: {}
  };

  const objectProperty = {
    xmlNodeName: objectXmlNodeName,
    attributes: [],
    type: MapElementTypeEnum.Object,
    body: {
      stringTypeProperty1: stringTypeProperty,
      stringTypeProperty2: stringTypeProperty
    }
  };

  const arrayProperty = {
    xmlNodeName: arrayXmlNodeName,
    attributes: [],
    type: MapElementTypeEnum.Array,
    body: { stringTypeProperty: stringTypeProperty }
  };

  const createMockMap = (body) => {
    return {
      root: {
        xmlNodeName: rootXmlNodeName,
        type: MapElementTypeEnum.Object,
        attributes: [],
        body: body
      }
    };
  };

  let recursiveConverter: RecursiveConverter;
  let mockXmlBuilderServiceInstance: XmlBuilder;

  beforeEach(() => {
    mockAddNode.mockClear();
    mockAddNodesArray.mockClear();
    mockUpdateAttributes.mockClear();
    mockBeginXmlDocument.mockClear();
    mockXmlBuilderService.mockClear();
    mockXmlBuilderServiceInstance = new mockXmlBuilderService();
  });

  it('should correctly call the beginXmlDocument and updateAttributes methods', () => {
    recursiveConverter = new RecursiveConverter(mockXmlBuilderServiceInstance, createMockMap({}));

    recursiveConverter.convert({});

    expect(mockXmlBuilderServiceInstance.updateAttributes).toHaveBeenCalledWith([], {});
    expect(mockXmlBuilderServiceInstance.beginXmlDocument).toHaveBeenCalledWith(
      rootXmlNodeName,
      {}
    );
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledTimes(0);
  });

  it('should correctly call the addNode method on the string case', () => {
    const jsonToXmlMapBody = { stringTypeProperty: stringTypeProperty };
    recursiveConverter = new RecursiveConverter(
      mockXmlBuilderServiceInstance,
      createMockMap(jsonToXmlMapBody)
    );
    const jsonInput = { stringTypeProperty: 'value' };

    recursiveConverter.convert(jsonInput);

    expect(mockXmlBuilderServiceInstance.updateAttributes).toHaveBeenCalledTimes(2);
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledWith(
      mockXmlElement,
      stringXmlNodeName,
      {},
      jsonInput.stringTypeProperty
    );
  });

  it('should correctly call the addNode method on the isoDate case', () => {
    const jsonToXmlMapBody = { isoDateProperty: isoDateProperty };
    recursiveConverter = new RecursiveConverter(
      mockXmlBuilderServiceInstance,
      createMockMap(jsonToXmlMapBody)
    );
    const jsonInput = { isoDateProperty: '1996-10-15T00:05Z' };

    recursiveConverter.convert(jsonInput);

    expect(mockXmlBuilderServiceInstance.updateAttributes).toHaveBeenCalledTimes(2);
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledWith(
      mockXmlElement,
      isoDateXmlNodeName,
      {},
      jsonInput.isoDateProperty
    );
  });

  it('should correctly call the addNode method on the entsoeBoolean case', () => {
    const jsonToXmlMapBody = { entsoeBooleanProperty: entsoeBooleanProperty };
    recursiveConverter = new RecursiveConverter(
      mockXmlBuilderServiceInstance,
      createMockMap(jsonToXmlMapBody)
    );
    const jsonInput = { entsoeBooleanProperty: 'A01' };

    recursiveConverter.convert(jsonInput);

    expect(mockXmlBuilderServiceInstance.updateAttributes).toHaveBeenCalledTimes(2);
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledWith(
      mockXmlElement,
      entsoeBooleanXmlNodeName,
      {},
      jsonInput.entsoeBooleanProperty
    );
  });

  it('should correctly call the addNode method on the object case', () => {
    const jsonToXmlMapBody = { objectProperty: objectProperty };
    recursiveConverter = new RecursiveConverter(
      mockXmlBuilderServiceInstance,
      createMockMap(jsonToXmlMapBody)
    );

    const jsonInput = {
      objectProperty: {
        stringTypeProperty1: 'value1',
        stringTypeProperty2: 'value2'
      }
    };

    recursiveConverter.convert(jsonInput);

    expect(mockXmlBuilderServiceInstance.updateAttributes).toHaveBeenCalledTimes(4);
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledTimes(3);
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledWith(
      mockXmlElement,
      objectXmlNodeName,
      {}
    );
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledWith(
      mockXmlElement,
      stringXmlNodeName,
      {},
      jsonInput.objectProperty.stringTypeProperty1
    );
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledWith(
      mockXmlElement,
      stringXmlNodeName,
      {},
      jsonInput.objectProperty.stringTypeProperty2
    );
  });

  it('should correctly call the addNodesArray method and addNode method on the array case', () => {
    const jsonToXmlMapBody = { arrayProperty: arrayProperty };
    recursiveConverter = new RecursiveConverter(
      mockXmlBuilderServiceInstance,
      createMockMap(jsonToXmlMapBody)
    );
    const jsonInput = {
      arrayProperty: [{ stringTypeProperty: 'value1' }, { stringTypeProperty: 'value2' }]
    };
    const expectedArrayArgument = jsonInput.arrayProperty.map(() => arrayProperty);

    recursiveConverter.convert(jsonInput);

    expect(mockXmlBuilderServiceInstance.updateAttributes).toHaveBeenCalledTimes(4);
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledTimes(2);
    expect(mockXmlBuilderServiceInstance.addNodesArray).toHaveBeenCalledWith(
      mockXmlElement,
      expectedArrayArgument
    );
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledWith(
      mockXmlElement,
      stringXmlNodeName,
      {},
      jsonInput.arrayProperty[0].stringTypeProperty
    );
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledWith(
      mockXmlElement,
      stringXmlNodeName,
      {},
      jsonInput.arrayProperty[1].stringTypeProperty
    );
  });

  it('should skip a map property if not present in the jsonInput', () => {
    const jsonToXmlMapBody = {
      stringTypeProperty1: stringTypeProperty,
      stringTypeProperty2: stringTypeProperty
    };
    recursiveConverter = new RecursiveConverter(
      mockXmlBuilderServiceInstance,
      createMockMap(jsonToXmlMapBody)
    );
    const jsonInputWithOneProperty = {
      stringTypeProperty1: 'value1'
    };

    recursiveConverter.convert(jsonInputWithOneProperty);

    expect(mockXmlBuilderServiceInstance.updateAttributes).toHaveBeenCalledTimes(2);
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledTimes(1);
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledWith(
      mockXmlElement,
      stringXmlNodeName,
      {},
      jsonInputWithOneProperty.stringTypeProperty1
    );
  });

  it('should skip an input property if not present in the map', () => {
    const jsonToXmlMapBody = { stringTypeProperty2: stringTypeProperty };
    recursiveConverter = new RecursiveConverter(
      mockXmlBuilderServiceInstance,
      createMockMap(jsonToXmlMapBody)
    );

    const jsonInput = {
      stringTypeProperty1: 'value1',
      stringTypeProperty2: 'value2'
    };

    recursiveConverter.convert(jsonInput);

    expect(mockXmlBuilderServiceInstance.updateAttributes).toHaveBeenCalledTimes(2);
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledTimes(1);
    expect(mockXmlBuilderServiceInstance.addNode).toHaveBeenCalledWith(
      mockXmlElement,
      stringXmlNodeName,
      {},
      jsonInput.stringTypeProperty2
    );
  });

  it('should throw an error if the map is empty', () => {
    recursiveConverter = new RecursiveConverter(mockXmlBuilderServiceInstance, {});

    const jsonInput = {
      stringTypeProperty1: 'value1',
      stringTypeProperty2: 'value2'
    };

    expect(() => recursiveConverter.convert(jsonInput)).toThrowError(
      new JsonToXmlMapNotCompleteError()
    );
  });

  it('should throw an error if the root property of the map is not defined', () => {
    recursiveConverter = new RecursiveConverter(mockXmlBuilderServiceInstance, { root: undefined });

    const jsonInput = { stringTypeProperty1: 'value1' };

    expect(() => recursiveConverter.convert(jsonInput)).toThrowError(
      new JsonToXmlMapNotCompleteError()
    );
  });

  it('should throw an error if the map contains an unsupported type', () => {
    const unsupportedType = 'list' as MapElementTypeEnum;
    const jsonToXmlMapBody = {
      stringTypeProperty: {
        xmlNodeName: stringXmlNodeName,
        attributes: [],
        type: unsupportedType,
        body: {}
      }
    };

    recursiveConverter = new RecursiveConverter(
      mockXmlBuilderServiceInstance,
      createMockMap(jsonToXmlMapBody)
    );

    const jsonInput = {
      stringTypeProperty: 'value'
    };

    expect(() => recursiveConverter.convert(jsonInput)).toThrowError(
      new TypeNotSupportedError(unsupportedType)
    );
  });
});
