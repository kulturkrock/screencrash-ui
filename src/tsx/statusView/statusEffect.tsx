import * as React from "react";

import { IEmpty, IEffect } from "../types";
import style from "../../less/statusView.module.less";

interface IProps {
  effect: IEffect;
}

class StatusEffect extends React.PureComponent<IProps, IEmpty> {
  public render(): JSX.Element {
    return (
      <div className={style.effectContainer}>
        <div className={style.textArea}>{this.props.effect.name}</div>
      </div>
    );
  }
}

export { StatusEffect };
