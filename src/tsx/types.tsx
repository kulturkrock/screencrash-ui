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
  WebPage,
}

interface IEffect {
  entityId: string;
  name: string;
  type: EffectType;
  duration?: number;
  currentTime?: number;
  lastSync?: number;
  playing?: boolean;
  looping?: boolean;
  muted?: boolean;
  volume?: number;
  visible?: boolean;
}

interface IEffectActionEvent {
  entityId: string;
  action_type: string;
  media_type: string;
  value?: string;
  numericValue?: number;
}

// Empty object, since there is no built-in for it
type IEmpty = Record<never, never>;

export {
  INode,
  INodeCollection,
  IEffect,
  EffectType,
  IEffectActionEvent,
  IEmpty,
};
