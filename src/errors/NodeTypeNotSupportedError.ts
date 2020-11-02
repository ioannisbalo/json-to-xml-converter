import { NodeTypeEnum } from '../enums/NodeTypeEnum';

export class NodeTypeNotSupportedError extends Error {
  public readonly status: number = 422;

  public constructor(nodeType: NodeTypeEnum, name: string) {
    super();
    this.message = `NodeType of type: '${nodeType}' for element '${name}' is not supported.`;
  }
}
