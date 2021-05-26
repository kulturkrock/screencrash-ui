import * as React from "react";
import { ICoreConnection } from "./coreConnection";
import { PdfViewer } from "./pdfViewer";
import { StatusView } from "./statusView";
import { Timeline } from "./timeline";
import { INodeCollection } from "./types";

import style from "../less/liveScreen.module.less";

interface IState {
  nodes: INodeCollection;
  history: string[];
  script: string;
}

class LiveScreen extends React.PureComponent<
  { coreConnection: ICoreConnection },
  IState
> {
  constructor(props: { coreConnection: ICoreConnection }) {
    super(props);
    this.state = { nodes: {}, history: [], script: null };
    this.handleKey = this.handleKey.bind(this);
  }

  public componentDidMount(): void {
    this.initConnection();
    document.addEventListener("keydown", this.handleKey);
  }

  public componentWillUnmount(): void {
    document.removeEventListener("keydown", this.handleKey);
  }

  public render(): JSX.Element {
    return (
      <div className={style.screen}>
        <StatusView />
        <Timeline nodes={this.state.nodes} history={this.state.history} />
        <PdfViewer script={this.state.script} />
      </div>
    );
  }

  private initConnection() {
    this.props.coreConnection.addEventListener("nodes", (event) => {
      this.setState({ nodes: event.detail });
    });
    this.props.coreConnection.addEventListener("history", (event) => {
      this.setState({ history: event.detail });
    });
    this.props.coreConnection.addEventListener("script", (event) => {
      this.setState({ script: event.detail });
    });

    this.props.coreConnection.handshake();
  }

  private handleKey(event: KeyboardEvent) {
    // Only accept keyboard shortcuts on first press and when nothing is focused
    if (document.activeElement === document.body && !event.repeat) {
      if (event.key === " ") {
        this.props.coreConnection.nextNode();
      }
    }
  }
}

export { LiveScreen };
