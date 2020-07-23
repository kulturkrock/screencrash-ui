import { INodeCollection } from "./types";

const eventNames = {nodes: "nodes", currentNode: "current-node"}

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
  addEventListener(event: "nodes",
                   listener: (event: CustomEvent<INodeCollection>) => void): void;
  addEventListener(event: "current-node",
                   listener: (event: CustomEvent<string>) => void): void;
}

/**
 * This is a dummy implementation of a connection
 * to the core, for use in development.
 */
class DummyCoreConnection extends EventTarget implements ICoreConnection {
  private nodes: INodeCollection;
  private currentNode: string;

  // We only use the address in the real core connection
  constructor(address: string) {
    super();
    this.nodes = {
      a: {next: "b", prompt: "Välkommen till Kulturkrocks senaste föreställning!"},
      b: {next: "c", prompt: "Jag ser att ni fortfarande är på väg in."},
      c: {next: "a", prompt: "Några av er kanske missade det, så jag säger det igen:"},
    };
    this.currentNode = "a";
  }

  public handshake() {
    this.dispatchEvent(new CustomEvent(eventNames.nodes, {detail: this.nodes}));
    this.dispatchEvent(new CustomEvent(eventNames.currentNode, {detail: this.currentNode}));
  }

  public nextNode() {
    this.currentNode = this.nodes[this.currentNode].next;
    this.dispatchEvent(new CustomEvent(eventNames.currentNode, {detail: this.currentNode}));
  }
}

export { ICoreConnection, DummyCoreConnection };
