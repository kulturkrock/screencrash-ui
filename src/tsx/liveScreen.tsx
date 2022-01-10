import * as React from "react";
import { ICoreConnection } from "./coreConnection";
import { PdfViewer } from "./pdfViewer";
import { StatusView } from "./statusView/statusView";
import { Timeline } from "./timeline";
import { INodeCollection, IEffect, IEffectActionEvent } from "./types";

import style from "../less/liveScreen.module.less";

// If we need more choices than this, we can add more keys here
const CHOICE_KEYS = ["z", "x", "c", "v"];

interface IProps {
  coreConnection: ICoreConnection;
}
interface IState {
  nodes: INodeCollection;
  history: string[];
  script: string;
  effects: IEffect[];
  autoscrollScript: boolean;
}

class LiveScreen extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      nodes: {},
      history: [],
      script: null,
      effects: [],
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

  private getSettings() {
    const settings = ["Gå till nästa nod: spacebar"];
    settings.push(
      "Autoscroll i manus är " +
        (this.state.autoscrollScript ? "PÅ" : "AV") +
        " (växla med S)",
    );
    return settings;
  }

  public render(): JSX.Element {
    const currentNodeId = this.state.history[this.state.history.length - 1];
    const currentNode = this.state.nodes[currentNodeId];
    return (
      <div className={style.screen}>
        <div>
          <div className={style.statusViewContainer}>
            <StatusView
              effects={this.state.effects}
              onEffectAction={this.handleEffectAction.bind(this)}
            />
          </div>
          <div className={style.settingsBox}>
            {this.getSettings().map((text, index) => (
              <div className={style.textRow} key={index}>
                {text}
              </div>
            ))}
          </div>
        </div>
        <Timeline
          nodes={this.state.nodes}
          history={this.state.history}
          focusY={200}
          choiceKeys={CHOICE_KEYS}
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
    this.props.coreConnection.addEventListener("effects", (event) => {
      this.setState({ effects: event.detail });
    });

    this.props.coreConnection.handshake();
  }

  private handleEffectAction(event: IEffectActionEvent): void {
    this.props.coreConnection.handleEffectAction(event);
  }

  private handleKey(event: KeyboardEvent) {
    // Only accept keyboard shortcuts on first press and when nothing is focused
    if (document.activeElement === document.body && !event.repeat) {
      if (event.key === " ") {
        this.props.coreConnection.nextNode();
      } else if (event.key === "s") {
        this.setState({ autoscrollScript: !this.state.autoscrollScript });
      } else if (CHOICE_KEYS.includes(event.key)) {
        const choiceIndex = CHOICE_KEYS.indexOf(event.key);
        this.props.coreConnection.choosePath(choiceIndex);
      }
    }
  }
}

export { LiveScreen };
