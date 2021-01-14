import {
  INodeCollection,
  IMedia,
  IMediaCollection,
  IAudioMediaState,
  IVideoMediaState,
} from "./types";

const eventNames = {
  nodes: "nodes",
  currentNode: "current-node",
  mediaAdded: "media-added",
  mediaRemoved: "media-removed",
};

/**
 * This class handles the communication with the core.
 * The user calls methods directly to
 * send a message to the core, and can register for events.
 */
interface ICoreConnection extends EventTarget {
  // UI-initiated actions
  handshake(): void;
  nextNode(): void;

  // Events
  addEventListener(
    event: "nodes",
    listener: (event: CustomEvent<INodeCollection>) => void,
  ): void;
  addEventListener(
    event: "current-node",
    listener: (event: CustomEvent<string>) => void,
  ): void;

  addEventListener(
    event: "media-added",
    listener: (event: CustomEvent<IMedia>) => void,
  ): void;
  addEventListener(
    event: "media-removed",
    listener: (event: CustomEvent<IMedia>) => void,
  ): void;
}

/**
 * This is a dummy implementation of a connection
 * to the core, for use in development.
 */
class DummyCoreConnection extends EventTarget implements ICoreConnection {
  private nodes: INodeCollection;
  private currentNode: string;
  private media: IMediaCollection;
  private activeMedia: string[];

  // We only use the address in the real core connection
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(address: string) {
    super();
    this.nodes = {
      a: {
        next: "b",
        prompt: "Välkommen till Kulturkrocks senaste föreställning!",
      },
      b: { next: "c", prompt: "Jag ser att ni fortfarande är på väg in." },
      c: {
        next: "a",
        prompt: "Några av er kanske missade det, så jag säger det igen:",
      },
    };
    this.currentNode = "a";

    this.media = {
      a: {
        type: "image",
        resource: "some_image.png",
        state: {
          visible: true,
        },
      },
      b: {
        type: "audio",
        resource: "some_audio.wav",
        state: {
          visible: true,
          playing: true,
          timestamp: 0,
          length: 45,
          volume: 100,
        } as IAudioMediaState,
      },
      c: {
        type: "media",
        resource: "some_video.mp4",
        state: {
          visible: true,
          playing: true,
          timestamp: 314,
          length: 360,
          volume: 100,
        } as IVideoMediaState,
      },
    };
    this.activeMedia = [];
  }

  public handshake(): void {
    this.dispatchEvent(
      new CustomEvent(eventNames.nodes, { detail: this.nodes }),
    );
    this.dispatchEvent(
      new CustomEvent(eventNames.currentNode, { detail: this.currentNode }),
    );
  }

  public nextNode(): void {
    this.currentNode = this.nodes[this.currentNode].next;
    this.dispatchEvent(
      new CustomEvent(eventNames.currentNode, { detail: this.currentNode }),
    );

    // Toggle media (for testing purposes)
    const remove = this.activeMedia.includes(this.currentNode);
    const eventName = remove ? eventNames.mediaRemoved : eventNames.mediaAdded;
    this.dispatchEvent(
      new CustomEvent(eventName, { detail: this.media[this.currentNode] }),
    );
    if (remove) {
      this.activeMedia.splice(this.activeMedia.indexOf(this.currentNode), 1);
    } else {
      this.activeMedia.push(this.currentNode);
    }
  }
}

export { ICoreConnection, DummyCoreConnection };
