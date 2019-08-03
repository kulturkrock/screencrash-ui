import * as React from "react";

interface IState {
  times: number;
}

class LiveScreen extends React.PureComponent<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = { times: 0 };
    this.handleKey = this.handleKey.bind(this);
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

  private handleKey(event: KeyboardEvent) {
    if (event.key === " ") {
      this.setState({ times: this.state.times + 1 });
    }
  }
}

export { LiveScreen };
