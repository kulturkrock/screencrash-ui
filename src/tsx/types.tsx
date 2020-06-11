interface INode {
  next: string;
  prompt: string;
}

interface INodeCollection {
    [index: string]: INode;
}

export { INode, INodeCollection };
