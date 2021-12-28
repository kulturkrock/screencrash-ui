import {
  INodeCollection,
  IEffect,
  EffectType,
  IEffectActionEvent,
} from "./types";
import script from "RESOURCES/script.pdf";

const eventNames = {
  nodes: "nodes",
  history: "history",
  script: "script",
  effects: "effects",
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
  handleEffectAction(event: IEffectActionEvent): void;

  // Events
  addEventListener(
    event: "nodes",
    listener: (event: CustomEvent<INodeCollection>) => void,
  ): void;
  addEventListener(
    event: "history",
    listener: (event: CustomEvent<string[]>) => void,
  ): void;
  addEventListener(
    event: "script",
    listener: (event: CustomEvent<string>) => void,
  ): void;
  addEventListener(
    event: "effects",
    listener: (event: CustomEvent<IEffect[]>) => void,
  ): void;
}

/**
 * This is a dummy implementation of a connection
 * to the core, for use in development.
 */
class DummyCoreConnection extends EventTarget implements ICoreConnection {
  private nodes: INodeCollection;
  private history: string[];
  private script: string;
  private currentEffectId: number;
  private effectStarts: { [nodeId: string]: IEffect[] };
  private activeEffects: IEffect[];
  private lastEffectUpdate: number;

  // We only use the address in the real core connection
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(address: string) {
    super();
    this.nodes = {
      "11": {
        next: "160",
        prompt:
          "Jag har hört att han är dömd att segla de sju haven för alltid i en fruktlös jakt på sin älskade!",
        pdfPage: 2,
        pdfLocationOnPage: 0.6,
      },
      "160": {
        next: "1126",
        prompt: "Ja, då var vi av med honom!",
        pdfPage: 8,
        pdfLocationOnPage: 0.4,
      },
      "1126": {
        next: "11",
        prompt: "Vad är tårtan till?",
        pdfPage: 48,
        pdfLocationOnPage: 0.48,
      },
    };
    this.history = ["1126"];
    this.script = script;
    this.currentEffectId = 0;
    this.effectStarts = {
      "11": [
        { id: 0, name: "someaudio", type: EffectType.Other },
        {
          id: 7,
          name: "moreaudio",
          type: EffectType.Audio,
          duration: 20,
          currentTime: 0,
          playing: true,
        },
      ],
      "160": [],
      "1126": [{ id: 9, name: "seagull.mp4", type: EffectType.Other }],
    };
    this.activeEffects = [];
    this.lastEffectUpdate = 0;
  }

  public handshake(): void {
    this.dispatchEvent(
      new CustomEvent(eventNames.nodes, { detail: this.nodes }),
    );
    this.dispatchEvent(
      new CustomEvent(eventNames.history, {
        detail: this.history,
      }),
    );
    this.dispatchEvent(
      new CustomEvent(eventNames.script, { detail: this.script }),
    );
    this.sendEffectsChangedEvent();

    this.lastEffectUpdate = Date.now();
    setInterval(this.updateEffects.bind(this), 50);
  }

  public nextNode(): void {
    const currentNodeId = this.history[this.history.length - 1];
    if (this.nodes[currentNodeId].next !== undefined) {
      this.history = [...this.history, this.nodes[currentNodeId].next];
      this.dispatchEvent(
        new CustomEvent(eventNames.history, {
          detail: this.history,
        }),
      );

      const newCurrentNodeId = this.history[this.history.length - 1];
      this.effectStarts[newCurrentNodeId].forEach((effect) => {
        const newEffect = {
          ...effect,
          id: this.currentEffectId,
          lastSync: Date.now(),
        };
        this.currentEffectId++;
        this.activeEffects.push(newEffect);
        if (!newEffect.duration) {
          setTimeout(
            this.removeEffect.bind(this, newEffect.id),
            2000 + Math.random() * 3000,
          );
        }
      });
      this.sendEffectsChangedEvent();
    }
  }

  public handleEffectAction(event: IEffectActionEvent): void {
    const effectIndex = this.activeEffects.findIndex(
      (effect) => effect.id == event.effectId,
    );

    if (effectIndex >= 0) {
      let changed = false;
      switch (event.type) {
        case "play":
          this.activeEffects[effectIndex].playing = true;
          changed = true;
          break;
        case "pause":
          this.activeEffects[effectIndex].playing = false;
          changed = true;
          break;
        case "stop":
          this.activeEffects.splice(effectIndex, 1);
          changed = true;
          break;
        case "toggle_loop":
          const loopEnabled = this.activeEffects[effectIndex].looping;
          this.activeEffects[effectIndex].looping = !loopEnabled;
          changed = true;
          break;
        case "toggle_mute":
          const muteEnabled = this.activeEffects[effectIndex].muted;
          this.activeEffects[effectIndex].muted = !muteEnabled;
          changed = true;
          break;
        case "change_volume":
          this.activeEffects[effectIndex].volume = event.numericValue;
          changed = false;
          break;
        default:
          console.log(`Unhandled effect action event: ${event.type}`);
          break;
      }

      if (changed) {
        this.sendEffectsChangedEvent();
      }
    }
  }

  private updateEffects(): void {
    const nofEffects = this.activeEffects.length;

    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastEffectUpdate;
    this.lastEffectUpdate = currentTime;

    this.activeEffects = this.activeEffects
      .map((effect) => {
        if (effect.duration && effect.playing) {
          effect.currentTime += timeDiff / 1000;
          if (effect.looping) {
            effect.currentTime = effect.currentTime % effect.duration;
          }
        }
        return { ...effect };
      })
      .filter((effect) => {
        return !effect.duration || effect.currentTime < effect.duration;
      });

    if (nofEffects != this.activeEffects.length) {
      this.sendEffectsChangedEvent();
    }
  }

  private sendEffectsChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent(eventNames.effects, {
        detail: [...this.activeEffects],
      }),
    );
  }

  private removeEffect(effectId: number): void {
    const index = this.activeEffects.findIndex(
      (effect) => effect.id === effectId,
    );
    this.activeEffects.splice(index, 1);
    this.sendEffectsChangedEvent();
  }
}

/**
 * This class encapsulates the connection to Core
 */
class RealCoreConnection extends EventTarget implements ICoreConnection {
  private address: string;
  private socket: WebSocket;

  constructor(address: string) {
    super();
    this.address = address;
  }

  public handshake(): void {
    this.socket = new WebSocket(`ws://${this.address}`);
    this.socket.addEventListener("open", () => {
      this.socket.send(JSON.stringify({ client: "ui" }));
    });
    this.socket.addEventListener("message", (event: MessageEvent) => {
      const { messageType, data } = JSON.parse(event.data);
      switch (messageType) {
        case "history":
          this.dispatchEvent(
            new CustomEvent(eventNames.history, {
              detail: data,
            }),
          );
          break;
        case "nodes":
          this.dispatchEvent(
            new CustomEvent(eventNames.nodes, {
              detail: data,
            }),
          );
          break;
        case "script":
          this.dispatchEvent(
            new CustomEvent(eventNames.script, { detail: data }),
          );
          break;
        default:
          console.error(`Unknown message from Core: ${messageType}`);
      }
    });
  }

  public nextNode(): void {
    this.socket.send(JSON.stringify({ messageType: "next-node" }));
  }

  public handleEffectAction(event: IEffectActionEvent): void {
    console.log(`TODO: Should handle effect action ${JSON.stringify(event)}`);
  }
}

export { ICoreConnection, DummyCoreConnection, RealCoreConnection };
