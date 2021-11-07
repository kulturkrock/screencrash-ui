import * as React from "react";

import { IEffect, IEmpty } from "../types";
import style from "../../less/statusView.module.less";
import { StatusEffect } from "./statusEffect";

interface IProps {
  effects: IEffect[];
}

class StatusView extends React.PureComponent<IProps, IEmpty> {
  public render(): JSX.Element {
    return (
      <div className={style.box}>
        {this.props.effects.map((effect) => (
          <StatusEffect key={effect.id} effect={effect} />
        ))}
      </div>
    );
  }
}

export { StatusView };
