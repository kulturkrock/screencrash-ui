/**
 * This class handles the communication with the core.
 * The user registers callbacks to be executed when the
 * core sends a message, and calls methods directly to
 * send a message to the core.
 */
interface ICoreConnection {
  // UI-initiated actions
  /** Example of UI-initiated action */
  askForIncrement(): void;

  // Callbacks for core-initiated actions
  /** Example of core-initiated action */
  onIncrement(callback: () => void): void;
}

/**
 * This is a dummy implementation of a connection
 * to the core, for use in development.
 */
class DummyCoreConnection implements ICoreConnection {
  private increment: () => void;

  public askForIncrement() {
    if (this.increment) {
      setTimeout(this.increment, 1000);
    }
  }

  public onIncrement(callback: () => void) {
    this.increment = callback;
  }
}

export { ICoreConnection, DummyCoreConnection };
