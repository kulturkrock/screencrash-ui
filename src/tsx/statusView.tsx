import * as React from "react";

import style from "../less/statusView.module.less";

interface IState {
    text: string;
}

class StatusView extends React.PureComponent<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = { text: "Jag är en statusvy" };
  }

  public render() {
    return (
      <div className={style.container}>
          <div className={style.textArea}>{this.state.text}</div>
      </div>
    );
  }
}

export { StatusView };
