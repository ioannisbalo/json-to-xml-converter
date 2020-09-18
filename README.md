# Json To Xml Converter

## Version

This readme has been last updated for version 0.1.0.

## Description

The purpose of this package is to convert javascript objects to XML strings (complying to Entsoe formatting standards).

## Installing and using the package

**NOTE**: To be able to install the package, the build step needs access to the IBM CIC bitbucket server.

- Add `git+<the bitbucket http url>`  to the package.json.
- Select the version to install by adding `#<the required tag>` at the end of the url.
 
For example:

`"json-to-xml-converter": "git+http://bitbucket.cic-garage.com/scm/ten/json-to-xml-converter.git#0.1.0"`

- Run `npm install`.

To use the package, you can simply:
```
import { JsonToXmlConverter } from 'json-to-xml-converter';

const jsonToXmlMap = JSON.parse(fs.readFileSync('./path/to/map').toString());

const jsonToXmlConverter = new JsonToXmlConverter(jsonToXmlMap);

jsonToXmlConverter.convert({
  key1: 'value1',
  key2: {
    key3: 3
  }
});
```

## Map structure and options
This package traverses and coverts the input recursively based on instructions provided in the JsonToXmlMapInterface format.

### Node options
For the following options we will suppose a json input of:
```
{
  key1: 1,
  key2: 2
}
```
* **keyName**: All keys of the map (except for the root key) need to correspond to keys from the json input to be converted.

For example, for the example input, the map needs to look like:
```
{
  key1: { <map element options> },
  key2: { <map element options> }
}
```

* **xmlNodeName**: This option represents the name of the resulting XML node (it could be the same as the keyName). For example:

Using map:
```
{
  key1: {
    xmlNodeName: 'KEY1',
    type: 'string'
  },
  key2: {
    xmlNodeName: 'key2',
    type: 'string'
  }
}
```
To convert the example would result in the XML string: `<KEY1>1</KEY1><key2>2</key2>`

* **type**: This option dictates the way that a value should be handled by the converter. Available types are:
1. string
2. entsoeBoolean
3. isoDate
4. object
5. array

For the example, both the types need to be `string`.

* **attributes**: This option defines the XML attributes that are going to be included in the XML node. 

Using map:
```
{
  key1: {
    xmlNodeName: 'KEY1',
    type: 'string',
    attributes: [
      {
        name: 'attribute1'
        value: 'attrValue1'
      }
    ]
  }
}
```
To convert key1 of the example would result in the XML string: `<KEY1 attribute1="attrValue1">1</KEY1><key2>2</key2>`

You can also provide a dynamic value for the attribute by changing the 'value' key to 'source' and providing another existing input key name.

For example Using map:
```
{
  key1: {
    xmlNodeName: 'KEY1',
    type: 'string',
    attributes: [
      {
        name: 'attribute1'
        source: 'key2'
      }
    ]
  }
}
```
To convert key1 of the example would result in the XML string: `<KEY1 attribute1="2">1</KEY1><key2>2</key2>`

* **body**: This option can (and needs to) be provided when the type option is either `object` or `array`.
The format of the body option is also according to the JsonToXmlMapInterface.

### Root information
The top level of the map needs to have specific information about the root node of the resulting XML document. For example:
```
const jsonToXmlMap = {
  root: {
    xmlNodeName: 'root_node'
    type: 'object'
    attributes: [],
    body: {
      <rest of the map>
    }
  }
}
```

## Complete example
Map:
```
const jsonToXmlMap = {
  root: {
    xmlNodeName: 'ExampleXML',
    type: 'object',
    attributes: [
      {
        name: 'xmlns',
        value: 'www.google.com'
      }
    ],
    body: {
      stringKey: {
        xmlNodeName: 'stringKey',
        type: 'string'
      },
      numberKey: {
        xmlNodeName: 'NumberKey',
        type: 'string',
        attributes: [
          {
            name: 'numAttr',
            source: 'numAttrValue'
          }
        ]
      },
      objectKey: {
        xmlNodeName: 'objectKey',
        type: 'object',
        body: {
          nestedKey1: {
            xmlNodeName: 'nestedKey1',
            type: 'string'
          }
        }
      },
      arrayKey: {
        xmlNodeName: 'arrayKey',
        type: 'object',
        body: {
          nestedKey2: {
            xmlNodeName: 'nestedKey2',
            type: 'string'
          }
        }
      }
    }
  }
};
```
With json input of:
```
const jsonInput = {
  stringKey: 'hello',
  numberKey: 2,
  numAttrValue: 'example',
  objectKey: {
    nestedKey1: 'iAmNested'
  },
  arrayKey: [
    {
      nestedKey2: 'iAmNestedArrayItem1'
    },
    {
      nestedKey2: 'iAmNestedArrayItem2'
    }
  ]
}
```
Would result in:
```
<ExampleXML xmlns="www.google.com">
    <stringKey>hello</stringKey>
    <NumberKey numAttr="example">2</NumberKey>
    <objectKey>
        <nestedKey1>iAmNested</nestedKey1>
    </objectKey>
    <arrayKey>
        <nestedKey2>iAmNestedArrayItem1</nestedKey2>
    </arrayKey>
    <arrayKey>
        <nestedKey2>iAmNestedArrayItem2</nestedKey2>
    </arrayKey>
</ExampleXML>
```
