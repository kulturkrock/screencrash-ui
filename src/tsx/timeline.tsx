import * as React from "react";

import style from "../less/timeline.module.less";

interface IState {
    text: string;
}

class Timeline extends React.PureComponent<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = { text: "Jag är en tidslinje" };
  }

  public render() {
    return (
      <div className={style.borderBox}>
          <div className={style.textArea}>{this.state.text}</div>
      </div>
    );
  }
}

export { Timeline };
