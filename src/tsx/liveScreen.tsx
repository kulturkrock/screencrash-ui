import * as React from "react";
import { ICoreConnection } from "./coreConnection";
import { PdfViewer } from "./pdfViewer";
import { StatusView } from "./statusView";
import { Timeline } from "./timeline";
import { INodeCollection } from "./types";

import style from "../less/liveScreen.module.less";

interface IProps {
  coreConnection: ICoreConnection;
}
interface IState {
  nodes: INodeCollection;
  history: string[];
  script: string;
  autoscrollScript: boolean;
}

class LiveScreen extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      nodes: {},
      history: [],
      script: null,
      autoscrollScript: true,
    };
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
    const currentNodeId = this.state.history[this.state.history.length - 1];
    const currentNode = this.state.nodes[currentNodeId];
    return (
      <div className={style.screen}>
        <StatusView autoscrollEnabled={this.state.autoscrollScript} />
        <Timeline
          nodes={this.state.nodes}
          history={this.state.history}
          focusY={200}
        />
        <PdfViewer
          script={this.state.script}
          currentPage={currentNode ? currentNode.pdfPage : 0}
          currentLocationOnPage={
            currentNode ? currentNode.pdfLocationOnPage : 0
          }
          focusY={200}
          scrollToCurrentLocation={this.state.autoscrollScript}
        />
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
      } else if (event.key === "s") {
        this.setState({ autoscrollScript: !this.state.autoscrollScript });
      }
    }
  }
}

export { LiveScreen };
