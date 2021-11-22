import * as React from "react";

import { IEmpty } from "../types";
import style from "../../less/statusView.module.less";

interface IProps {
  currentTime: number;
  duration: number;
}

class ProgressBar extends React.PureComponent<IProps, IEmpty> {
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

  public getLabel(): string {
    return (
      getTimeAsMinutes(this.props.currentTime) +
      " / " +
      getTimeAsMinutes(this.props.duration)
    );
  }

  public barWidth(): number {
    if (this.props.duration == 0) {
      return 100;
    }

    return Math.round((this.props.currentTime / this.props.duration) * 100);
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
