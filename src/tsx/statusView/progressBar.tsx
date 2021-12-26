import * as React from "react";

import { IEmpty } from "../types";
import style from "../../less/statusView.module.less";

interface IState {
  lastUpdated: number;
  currentTime: number;
}

interface IProps {
  currentTime: number;
  lastUpdated: number;
  duration: number;
  looping: boolean;
  running: boolean;
}

class ProgressBar extends React.PureComponent<IProps, IState> {
  timerID: number;

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentTime: this.props.currentTime,
      lastUpdated: this.props.lastUpdated,
    };
  }

  componentDidMount(): void {
    this.timerID = setInterval(() => this.updateTime(), 200);
  }

  componentWillUnmount(): void {
    clearInterval(this.timerID);
  }

  public render(): JSX.Element {
    return (
      <div className={style.progressBarWrapper}>
        <div
          className={style.progressBar}
          style={{ width: `${this.barWidth()}%` }}
        ></div>
        <div className={style.progressBarText}>{this.getLabel()}</div>
      </div>
    );
  }

  public updateTime(): void {
    const now = Date.now();
    if (this.props.running) {
      const timeDiff = now - this.state.lastUpdated;
      let newTime = this.state.currentTime + timeDiff / 1000;
      if (this.props.looping) {
        newTime = newTime % this.props.duration;
      } else {
        newTime = Math.min(newTime, this.props.duration);
      }

      this.setState({
        ...this.state,
        lastUpdated: now,
        currentTime: newTime,
      });
    } else {
      this.setState({ ...this.state, lastUpdated: now });
    }
  }

  public getLabel(): string {
    return (
      getTimeAsMinutes(this.state.currentTime) +
      " / " +
      getTimeAsMinutes(this.props.duration)
    );
  }

  public barWidth(): number {
    if (this.props.duration == 0) {
      return 100;
    }

    return Math.round((this.state.currentTime / this.props.duration) * 100);
  }
}

function getTimeAsMinutes(seconds: number): string {
  return (
    getNumAsTwoDigit(Math.floor(seconds / 60)) +
    ":" +
    getNumAsTwoDigit(Math.floor(seconds % 60))
  );
}

function getNumAsTwoDigit(num: number): string {
  return (num < 10 ? "0" : "") + num;
}

export { ProgressBar };
