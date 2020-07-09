import * as React from "react";

import { IEmpty } from "./types";
import style from "../less/statusView.module.less";

interface IState {
  text: string;
}

class StatusView extends React.PureComponent<IEmpty, IState> {
  constructor(props: IEmpty) {
    super(props);
    this.state = { text: "Jag är en statusvy" };
  }

  public render(): JSX.Element {
    return (
      <div className={style.container}>
        <div className={style.textArea}>{this.state.text}</div>
      </div>
    );
  }
}

export { StatusView };
