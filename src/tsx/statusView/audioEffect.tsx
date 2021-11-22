import * as React from "react";

import style from "../../less/statusView.module.less";
import { IEffect, IEffectActionEvent } from "../types";
import { ProgressBar } from "./progressBar";

import {
  MdPlayArrow,
  MdPause,
  MdStop,
  MdLoop,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";

interface IState {
  volume: number;
}

interface IProps {
  effect: IEffect;
  onEffectAction: (event: IEffectActionEvent) => void;
}

class AudioEffect extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      volume: this.props.effect.volume ? this.props.effect.volume : 50,
    };
  }

  public render(): JSX.Element {
    return (
      <div>
        <div className={style.audioInfo}>
          <div className={style.audioName}>{this.props.effect.name}</div>
          <div
            className={`${style.audioAction} ${style.audioMute}`}
            onClick={this.sendToggleMute.bind(this)}
          >
            {this.getMuteButton()}
          </div>
          <div
            className={`${style.audioAction} ${style.audioPlayPause}`}
            onClick={this.sendPlayPause.bind(this)}
          >
            {this.getPlayPauseButton()}
          </div>
          <div
            className={`${style.audioAction} ${style.audioStop}`}
            onClick={this.sendStop.bind(this)}
          >
            <MdStop />
          </div>
          <div
            className={`${style.audioAction} ${style.audioLoop} ${
              this.props.effect.looping ? style.looping : ""
            }`}
            onClick={this.sendToggleLoop.bind(this)}
          >
            <MdLoop />
          </div>
          <div className={style.volumeValue}>{this.state.volume}</div>
          <input
            className={`${style.volumeInput} ${style.slider}`}
            type="range"
            min="0"
            max="100"
            value={this.props.effect.volume}
            onChange={(e) => this.updateVolume(parseInt(e.target.value))}
          />
        </div>
        <ProgressBar
          duration={this.props.effect.duration}
          currentTime={this.props.effect.currentTime}
        />
      </div>
    );
  }

  private getMuteButton(): JSX.Element {
    if (this.props.effect.muted) {
      return <MdVolumeOff />;
    } else {
      return <MdVolumeUp />;
    }
  }

  private getPlayPauseButton(): JSX.Element {
    if (this.props.effect.playing) {
      return <MdPause />;
    } else {
      return <MdPlayArrow />;
    }
  }

  private updateVolume(volume: number): void {
    this.setState({ ...this.state, volume: volume });
  }

  private sendToggleMute(): void {
    this.props.onEffectAction({
      effectId: this.props.effect.id,
      type: "toggle_mute",
    });
  }

  private sendPlayPause(): void {
    const eventType = this.props.effect.playing ? "pause" : "play";
    this.props.onEffectAction({
      effectId: this.props.effect.id,
      type: eventType,
    });
  }

  private sendStop(): void {
    this.props.onEffectAction({
      effectId: this.props.effect.id,
      type: "stop",
    });
  }

  private sendToggleLoop(): void {
    this.props.onEffectAction({
      effectId: this.props.effect.id,
      type: "toggle_loop",
    });
  }
}

export { AudioEffect };
