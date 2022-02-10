import * as React from "react";

import style from "../less/statusView.module.less";
import { ComponentView } from "./componentView";
import { EffectView } from "./effectView/effectView";
import { LogView } from "./logView";
import {
  IComponentInfo,
  IEffect,
  IEffectActionEvent,
  ILogMessage,
} from "./types";

const tabs = {
  effects: "effects",
  components: "components",
  logs: "log",
};

interface IProps {
  effects: IEffect[];
  onEffectAction: (event: IEffectActionEvent) => void;
  onComponentReset: (componentId: string) => void;
  onComponentRestart: (componentId: string) => void;
  components: IComponentInfo[];
  logMessages: ILogMessage[];
  onClearLogMessages: () => void;
}

interface IPropsTab {
  tabName: string;
  props: IProps;
}

interface IState {
  currentTab: string;
}

class StatusView extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { currentTab: tabs.logs };

    this.handleKey = this.handleKey.bind(this);
  }

  public componentDidMount(): void {
    document.addEventListener("keydown", this.handleKey);
  }

  public componentWillUnmount(): void {
    document.removeEventListener("keydown", this.handleKey);
  }

  public render(): JSX.Element {
    return (
      <div className={style.container}>
        <div className={style.tabBar}>
          <div
            className={`${style.tab} ${
              this.state.currentTab == tabs.effects ? style.selected : ""
            }`}
            onClick={this.setTab.bind(this, tabs.effects)}
          >
            {this.getTabText("Effects", "FX", tabs.effects)}
          </div>
          <div
            className={`${style.tab} ${
              this.state.currentTab == tabs.components ? style.selected : ""
            }`}
            onClick={this.setTab.bind(this, tabs.components)}
          >
            {this.getTabText("Components", "COMP", tabs.components)} (
            {this.props.components.length})
          </div>
          <div
            className={`${style.tab} ${
              this.state.currentTab == tabs.logs ? style.selected : ""
            }`}
            onClick={this.setTab.bind(this, tabs.logs)}
          >
            {this.getTabText("Logs", "LOG", tabs.logs)} (
            {this.props.logMessages.length})
          </div>
        </div>
        <div className={style.tabContent}>
          <TabContent tabName={this.state.currentTab} props={this.props} />
        </div>
      </div>
    );
  }

  public setTab(tabName: string): void {
    this.setState({ ...this.state, currentTab: tabName });
  }

  private getTabText(
    longName: string,
    shortName: string,
    tabName: string,
  ): JSX.Element {
    if (this.state.currentTab == tabName) {
      return <span>{longName}</span>;
    } else {
      return <span className={style.shortName}>{shortName}</span>;
    }
  }

  private handleKey(event: KeyboardEvent) {
    // Only accept keyboard shortcuts when nothing is focused
    if (document.activeElement === document.body && !event.repeat) {
      console.log(event.key);
      if (event.key === "1") {
        this.setTab(tabs.effects);
      } else if (event.key === "2") {
        this.setTab(tabs.components);
      } else if (event.key === "3") {
        this.setTab(tabs.logs);
      }
    }
  }
}

function TabContent(propsData: IPropsTab): JSX.Element {
  if (propsData.tabName === tabs.effects) {
    return (
      <EffectView
        effects={propsData.props.effects}
        onEffectAction={propsData.props.onEffectAction}
      />
    );
  } else if (propsData.tabName == tabs.components) {
    return (
      <ComponentView
        components={propsData.props.components}
        onReset={propsData.props.onComponentReset}
        onRestart={propsData.props.onComponentRestart}
      />
    );
  } else if (propsData.tabName == tabs.logs) {
    return (
      <LogView
        logMessages={propsData.props.logMessages}
        onClearMessages={propsData.props.onClearLogMessages}
      />
    );
  }
  return null;
}

export { StatusView };
