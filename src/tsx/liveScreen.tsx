import * as React from "react";
import { ICoreConnection } from "./coreConnection";
import { PdfViewer } from "./pdfViewer";
import { StatusView } from "./statusView";
import { Timeline } from "./timeline";

import style from "../less/liveScreen.module.less";

interface IState {
  times: number;
}

class LiveScreen extends React.PureComponent<{ coreConnection: ICoreConnection }, IState> {
  constructor(props: { coreConnection: ICoreConnection }) {
    super(props);
    this.state = { times: 0 };
    this.handleKey = this.handleKey.bind(this);
    this.registerCallbacks();
  }

  public componentDidMount() {
    document.addEventListener("keydown", this.handleKey);
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKey);
  }

  public render() {
    return (
      <div className={style.screen}>
        <StatusView/>
        <Timeline/>
        <PdfViewer/>
      </div>
    );
  }

  private registerCallbacks() {
    this.props.coreConnection.addEventListener("increment", () => {
      this.setState({ times: this.state.times + 1 });
    });
  }

  private handleKey(event: KeyboardEvent) {
    // Only accept keyboard shortcuts on first press and when nothing is focused
    if (document.activeElement === document.body && !event.repeat) {
      if (event.key === " ") {
        this.props.coreConnection.askForIncrement();
      }
    }
  }
}

export { LiveScreen };
