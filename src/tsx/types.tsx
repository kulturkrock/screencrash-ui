interface INode {
  next: string;
  prompt: string;
}

interface INodeCollection {
  [index: string]: INode;
}

interface IMedia {
  type: string;
  resource: string;
  state: IMediaState;
}

interface IMediaCollection {
  [index: string]: IMedia;
}

interface IMediaState {
  visible: boolean;
}

interface IAudioMediaState extends IMediaState {
  playing: boolean;
  timestamp: number;
  length: number;
  volume: number;
}

interface IVideoMediaState extends IMediaState {
  playing: boolean;
  timestamp: number;
  length: number;
  volume: number;
}

// Empty object, since there is no built-in for it
type IEmpty = Record<never, never>;

export {
  IEmpty,
  INode,
  INodeCollection,
  IMedia,
  IMediaCollection,
  IMediaState,
  IAudioMediaState,
  IVideoMediaState,
};
