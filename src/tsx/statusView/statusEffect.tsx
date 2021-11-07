import * as React from "react";

import { IEmpty, IEffect, EffectType } from "../types";
import style from "../../less/statusView.module.less";

interface IProps {
  effect: IEffect;
}

class StatusEffect extends React.PureComponent<IProps, IEmpty> {
  public render(): JSX.Element {
    return (
      <div className={style.effectContainer}>
        <EffectContent effect={this.props.effect} />
      </div>
    );
  }
}

function EffectContent(props: IProps) {
  switch (props.effect.type) {
    case EffectType.Other:
      return BaseEffectContent(props);
    case EffectType.Audio:
      return AudioEffectContent(props);
    case EffectType.Video:
      return VideoEffectContent(props);
    case EffectType.Image:
      return ImageEffectContent(props);
    default:
      return UnknownEffectContent(props);
  }
}

function UnknownEffectContent(props: IProps): JSX.Element {
  return (
    <div className={style.textArea}>
      UNKNOWN EFFECT TYPE ({props.effect.name})
    </div>
  );
}

function BaseEffectContent(props: IProps): JSX.Element {
  return <div className={style.textArea}>{props.effect.name}</div>;
}

function ImageEffectContent(props: IProps): JSX.Element {
  return <div className={style.textArea}>{props.effect.name} [IMAGE]</div>;
}

function VideoEffectContent(props: IProps): JSX.Element {
  return <div className={style.textArea}>{props.effect.name} [VIDEO]</div>;
}

function AudioEffectContent(props: IProps): JSX.Element {
  return (
    <div className={style.textArea}>
      {props.effect.name} (duration: {props.effect.duration})
    </div>
  );
}

export { StatusEffect };
