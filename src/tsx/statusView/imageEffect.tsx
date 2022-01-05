import * as React from "react";

import style from "../../less/statusView.module.less";
import { IEmpty, IEffect, IEffectActionEvent } from "../types";

import { MdOutlineImage, MdOutlineHideImage } from "react-icons/md";

interface IProps {
  effect: IEffect;
  onEffectAction: (event: IEffectActionEvent) => void;
}

class ImageEffect extends React.PureComponent<IProps, IEmpty> {
  public render(): JSX.Element {
    return (
      <div className={style.imageInfo}>
        <div className={style.imageName}>{this.props.effect.name}</div>
        <div
          className={`${style.imageAction}`}
          onClick={this.sendToggleHidden.bind(this)}
        >
          {this.getHideButton()}
        </div>
      </div>
    );
  }

  private getHideButton(): JSX.Element {
    if (this.props.effect.visible) {
      return <MdOutlineImage />;
    } else {
      return <MdOutlineHideImage />;
    }
  }

  private sendToggleHidden(): void {
    const eventType = this.props.effect.visible ? "hide" : "show";
    this.props.onEffectAction({
      entityId: this.props.effect.entityId,
      action_type: eventType,
      media_type: "image",
    });
  }
}

export { ImageEffect };
