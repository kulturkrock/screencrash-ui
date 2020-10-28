import { INodeCollection } from "./types";

const eventNames = { nodes: "nodes", history: "history" };

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
    event: "history",
    listener: (event: CustomEvent<string[]>) => void,
  ): void;
}

/**
 * This is a dummy implementation of a connection
 * to the core, for use in development.
 */
class DummyCoreConnection extends EventTarget implements ICoreConnection {
  private nodes: INodeCollection;
  private history: string[];

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
    this.history = ["a"];
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
  }

  public nextNode(): void {
    const currentNodeId = this.history[this.history.length - 1];
    this.history = [...this.history, this.nodes[currentNodeId].next];
    this.dispatchEvent(
      new CustomEvent(eventNames.history, {
        detail: this.history,
      }),
    );
  }
}

export { ICoreConnection, DummyCoreConnection };
