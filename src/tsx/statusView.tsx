import * as React from "react";

import style from "../less/statusView.module.less";
import { ComponentView } from "./componentView";
import { EffectView } from "./effectView/effectView";
import { IComponentInfo, IEffect, IEffectActionEvent } from "./types";

const tabs = {
  effects: "effects",
  components: "components",
};

interface IProps {
  effects: IEffect[];
  onEffectAction: (event: IEffectActionEvent) => void;
  components: IComponentInfo[];
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
    this.state = { currentTab: tabs.effects };

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
            Effects
          </div>
          <div
            className={`${style.tab} ${
              this.state.currentTab == tabs.components ? style.selected : ""
            }`}
            onClick={this.setTab.bind(this, tabs.components)}
          >
            Components ({this.props.components.length})
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

  private handleKey(event: KeyboardEvent) {
    // Only accept keyboard shortcuts when nothing is focused
    if (document.activeElement === document.body && !event.repeat) {
      console.log(event.key);
      if (event.key === "1") {
        this.setTab(tabs.effects);
      } else if (event.key === "2") {
        this.setTab(tabs.components);
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
    return <ComponentView components={propsData.props.components} />;
  }
  return null;
}

export { StatusView };
