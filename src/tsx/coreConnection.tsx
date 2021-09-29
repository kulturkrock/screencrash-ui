import { INodeCollection } from "./types";
import script from "../../sample_data/script.pdf";

const eventNames = {
  nodes: "nodes",
  history: "history",
  script: "script",
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
    event: "history",
    listener: (event: CustomEvent<string[]>) => void,
  ): void;
  addEventListener(
    event: "script",
    listener: (event: CustomEvent<string>) => void,
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
    this.script = script;
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
    }
  }
}

export { ICoreConnection, DummyCoreConnection };
