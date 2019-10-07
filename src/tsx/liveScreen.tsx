import * as React from "react";
import { ICoreConnection } from "./coreConnection";

interface IState {
  times: number;
}

class LiveScreen extends React.PureComponent<{coreConnection: ICoreConnection}, IState> {
  constructor(props: {coreConnection: ICoreConnection}) {
    super(props);
    this.state = { times: 0 };
    this.handleKey = this.handleKey.bind(this);
    this.registerCallbacks();
  }

  public componentDidMount() {
    document.addEventListener("keydown", this.handleKey);
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKey);
  }

  public render() {
    return (
      <section>
        <h1>Nu spelar vi upp en föreställning!</h1>
        <div>Du har tryckt mellanslag {this.state.times} gånger.</div>
      </section>
    );
  }

  private registerCallbacks() {
    this.props.coreConnection.onIncrement(() => {
      this.setState({ times: this.state.times + 1 });
    });
  }

  private handleKey(event: KeyboardEvent) {
    if (event.key === " " && !event.repeat) {
      this.props.coreConnection.askForIncrement();
    }
  }
}

export { LiveScreen };
