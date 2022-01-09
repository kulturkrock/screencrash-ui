import { INodeCollection, IEffect, IEffectActionEvent } from "./types";
import { OnTheFlyAction } from "./coreMessages";

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
        case "effects":
          this.dispatchEvent(
            new CustomEvent(eventNames.effects, { detail: data }),
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
    const message: OnTheFlyAction = {
      messageType: "component-action",
      target_component: event.media_type,
      cmd: "",
      assets: [],
      params: {},
    };

    switch (event.action_type) {
      case "play":
        message.cmd = "play";
        message.params["entityId"] = event.entityId;
        break;
      case "pause":
        message.cmd = "pause";
        message.params["entityId"] = event.entityId;
        break;
      case "stop":
        message.cmd = "stop";
        message.params["entityId"] = event.entityId;
        break;
      case "toggle_loop":
        console.log("TODO: Toggle loop");
        break;
      case "toggle_mute":
        message.cmd = "toggle_mute";
        message.params["entityId"] = event.entityId;
        break;
      case "change_volume":
        message.cmd = "set_volume";
        message.params["entityId"] = event.entityId;
        message.params["volume"] = event.numericValue;
        break;
      case "destroy":
        message.cmd = "destroy";
        message.params["entityId"] = event.entityId;
        break;
      case "hide":
        message.cmd = "hide";
        message.params["entityId"] = event.entityId;
        break;
      case "show":
        message.cmd = "show";
        message.params["entityId"] = event.entityId;
        break;
      case "refresh":
        message.cmd = "refresh";
        message.params["entityId"] = event.entityId;
        break;
      default:
        console.log(`Unhandled effect action event: ${event.action_type}`);
        break;
    }

    if (message.cmd !== "") {
      this.socket.send(JSON.stringify(message));
    }
  }
}

export { ICoreConnection, RealCoreConnection };
