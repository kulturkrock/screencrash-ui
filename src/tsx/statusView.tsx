import * as React from "react";

import { IEmpty } from "./types";
import style from "../less/statusView.module.less";

interface IProps {
  autoscrollEnabled: boolean;
}

interface IState {
  text: string;
}

class StatusView extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { text: "Jag är en statusvy" };
  }

  private getSettings() {
    const mytext = ["Gå till nästa nod: spacebar"];
    mytext.push(
      "Autoscroll i manus är " + (this.props.autoscrollEnabled ? "PÅ" : "AV"),
    );
    return mytext;
  }

  public render(): JSX.Element {
    return (
      <div className={style.container}>
        <div className={style.box}>
          <div className={style.textArea}>{this.state.text}</div>
        </div>
        <div className={style.settingsBox}>
          {this.getSettings().map((text, index) => (
            <div className={style.textRow} key={index}>
              {text}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export { StatusView };
