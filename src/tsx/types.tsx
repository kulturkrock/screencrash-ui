interface INode {
  next: string;
  prompt: string;
  pdfPage: number;
  pdfLocationOnPage: number;
}

interface INodeCollection {
  [index: string]: INode;
}

interface IEffect {
  id: number;
  name: string;
}

// Empty object, since there is no built-in for it
type IEmpty = Record<never, never>;

export { INode, INodeCollection, IEffect, IEmpty };
