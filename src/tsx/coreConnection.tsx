/**
 * This class handles the communication with the core.
 * The user calls methods directly to
 * send a message to the core, and can register for events.
 */
interface ICoreConnection extends EventTarget {
  // UI-initiated actions
  /** Example of UI-initiated action */
  askForIncrement(): void;

  // Events
  addEventListener(event: "increment", listener: () => void): void;
}

/**
 * This is a dummy implementation of a connection
 * to the core, for use in development.
 */
class DummyCoreConnection extends EventTarget implements ICoreConnection {

  // We only use the address in the real core connection
  // tslint:disable-next-line no-empty
  constructor(address: string) {
    super();
  }

  public askForIncrement() {
    setTimeout(() => this.dispatchEvent(new Event("increment")), 1000);
  }
}

export { ICoreConnection, DummyCoreConnection };
