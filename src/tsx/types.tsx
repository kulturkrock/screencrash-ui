interface INodeChoice {
  node: string;
  description: string;
}
interface INode {
  next: string | INodeChoice[];
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
  currentImage?: string;
}

interface IEffectActionEvent {
  entityId: string;
  action_type: string;
  media_type: string;
  value?: string;
  numericValue?: number;
}

interface IComponentInfo {
  componentId: string;
  componentName: string;
  status: string;
}

interface IConnectionState {
  connected: boolean;
}

// Empty object, since there is no built-in for it
type IEmpty = Record<never, never>;

export {
  INodeChoice,
  INode,
  INodeCollection,
  IEffect,
  EffectType,
  IEffectActionEvent,
  IComponentInfo,
  IConnectionState,
  IEmpty,
};
