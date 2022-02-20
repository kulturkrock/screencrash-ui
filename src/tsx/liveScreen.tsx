import * as React from "react";
import { ICoreConnection } from "./coreConnection";
import { PdfViewer } from "./pdfViewer";
import { StatusView } from "./statusView";
import { Timeline } from "./timeline";
import {
  INodeCollection,
  IEffect,
  IEffectActionEvent,
  IComponentState,
  ILogMessage,
} from "./types";

import {
  MdOutlineKeyboardReturn,
  MdOutlineArrowDownward,
  MdOutlineArrowUpward,
  MdOutlineSpaceBar,
} from "react-icons/md";

import style from "../less/liveScreen.module.less";

// If we need more choices than this, we can add more keys here
const CHOICE_KEYS = ["z", "x", "c", "v", "b", "n", "m"];

interface IProps {
  coreConnection: ICoreConnection;
  maxNofLogs: number;
}
interface IState {
  nodes: INodeCollection;
  history: string[];
  script: string;
  components: IComponentState[];
  effects: IEffect[];
  autoscrollScript: boolean;
  logMessages: ILogMessage[];
  showActionsOnNodes: boolean;
}

class LiveScreen extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      nodes: {},
      history: [],
      script: null,
      components: [],
      effects: [],
      autoscrollScript: true,
      logMessages: [],
      showActionsOnNodes: true,
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
        <div className={style.leftContainer}>
          <div className={style.statusViewContainer}>
            <StatusView
              effects={this.state.effects}
              onEffectAction={this.handleEffectAction.bind(this)}
              onComponentReset={this.handleComponentReset.bind(this)}
              onComponentRestart={this.handleComponentRestart.bind(this)}
              components={this.state.components}
              logMessages={this.state.logMessages}
              onClearLogMessages={this.handleClearLogMessages.bind(this)}
            />
          </div>
          <SettingsBox
            autoscrollScript={this.state.autoscrollScript}
            showActionsForNodes={this.state.showActionsOnNodes}
          />
        </div>
        <Timeline
          nodes={this.state.nodes}
          history={this.state.history}
          focusY={200}
          choiceKeys={CHOICE_KEYS}
          showActions={this.state.showActionsOnNodes}
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
    this.props.coreConnection.addEventListener("components", (event) => {
      this.setState({ components: event.detail });
    });
    this.props.coreConnection.addEventListener("effects", (event) => {
      this.setState({ effects: event.detail });
    });
    this.props.coreConnection.addEventListener("logs", (event) => {
      this.setState({
        logMessages: event.detail.slice(-this.props.maxNofLogs),
      });
    });
    this.props.coreConnection.addEventListener("log-added", (event) => {
      this.setState({
        logMessages: [
          ...this.state.logMessages.slice(-this.props.maxNofLogs + 1),
          event.detail,
        ],
      });
    });

    this.props.coreConnection.handshake();
  }

  private handleEffectAction(event: IEffectActionEvent): void {
    this.props.coreConnection.handleEffectAction(event);
  }

  private handleClearLogMessages(): void {
    this.props.coreConnection.handleClearLogMessages();
  }

  private handleComponentReset(componentId: string): void {
    this.props.coreConnection.handleComponentReset(componentId);
  }

  private handleComponentRestart(componentId: string): void {
    this.props.coreConnection.handleComponentRestart(componentId);
  }

  private handleKey(event: KeyboardEvent) {
    // Only accept keyboard shortcuts on first press and when nothing is focused
    if (document.activeElement === document.body && !event.repeat) {
      if (event.key === " ") {
        this.props.coreConnection.nextNode(true);
      } else if (event.key == "Up" || event.key == "ArrowUp") {
        this.props.coreConnection.prevNode();
      } else if (event.key == "Down" || event.key == "ArrowDown") {
        this.props.coreConnection.nextNode(false);
      } else if (event.key == "Enter") {
        this.props.coreConnection.runActions();
      } else if (event.key === "s") {
        this.setState({ autoscrollScript: !this.state.autoscrollScript });
      } else if (event.key === "a") {
        this.setState({ showActionsOnNodes: !this.state.showActionsOnNodes });
      } else if (CHOICE_KEYS.includes(event.key.toLowerCase())) {
        const choiceIndex = CHOICE_KEYS.indexOf(event.key.toLowerCase());
        const runActions = event.key !== event.key.toUpperCase();
        this.props.coreConnection.choosePath(choiceIndex, runActions);
      }
    }
  }
}

function SettingsBox(props: {
  autoscrollScript: boolean;
  showActionsForNodes: boolean;
}): JSX.Element {
  return (
    <div className={style.settingsBox}>
      <div className={style.textRow}>
        S: Autoscroll i manus är {props.autoscrollScript ? "PÅ" : "AV"}
      </div>
      <div className={style.textRow}>
        A: Visa actions för nodes {props.showActionsForNodes ? "PÅ" : "AV"}
      </div>
      <div className={style.textRow}>
        <MdOutlineSpaceBar /> Kör actions + nästa nod
      </div>
      <div className={style.textRow}>
        <MdOutlineKeyboardReturn /> Kör actions
      </div>
      <div className={style.textRow}>
        <MdOutlineArrowDownward /> Nästa nod
      </div>
      <div className={style.textRow}>
        <MdOutlineArrowUpward /> Föregående nod
      </div>
      <div className={style.textRow}>
        z, x, c...: Multichoice + köra dess actions
      </div>
      <div className={style.textRow}>
        Z, X, C...: Multichoice + utan dess actions
      </div>
      <div className={style.textRow}>1, 2, 3...: Byt mellan status-tabbar</div>
    </div>
  );
}

export { LiveScreen };
