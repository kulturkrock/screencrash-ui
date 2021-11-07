interface INode {
  next: string;
  prompt: string;
  pdfPage: number;
  pdfLocationOnPage: number;
}

interface INodeCollection {
  [index: string]: INode;
}

enum EffectType {
  Other,
  Audio,
  Video,
  Image,
}

interface IEffect {
  id: number;
  name: string;
  type: EffectType;
  duration?: number;
}

// Empty object, since there is no built-in for it
type IEmpty = Record<never, never>;

export { INode, INodeCollection, IEffect, EffectType, IEmpty };
