import * as React from "react";

import style from "../less/liveScreen.module.less";

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
      <div className={style.screen}>
        <h1>Nu spelar vi upp en föreställning!</h1>
        <div>Du har tryckt mellanslag {this.state.times} gånger.</div>
      </div>
    );
  }

  private handleKey(event: KeyboardEvent) {
    if (event.key === " " && !event.repeat) {
      this.setState({ times: this.state.times + 1 });
    }
  }
}

export { LiveScreen };
