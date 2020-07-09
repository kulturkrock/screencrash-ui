interface INode {
  next: string;
  prompt: string;
}

interface INodeCollection {
  [index: string]: INode;
}

// Empty object, since there is no built-in for it
type IEmpty = Record<never, never>;

export { INode, INodeCollection, IEmpty };
