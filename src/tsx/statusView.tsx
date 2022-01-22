import * as React from "react";

import style from "../less/statusView.module.less";
import { ComponentView } from "./componentView";
import { EffectView } from "./effectView/effectView";
import { IComponentInfo, IEffect, IEffectActionEvent } from "./types";

const availableTabs: string[] = ["Effects", "Components"];

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
    this.state = { currentTab: availableTabs[0] };
  }

  public render(): JSX.Element {
    return (
      <div className={style.container}>
        <div className={style.tabBar}>
          {availableTabs.map((tab) => (
            <div
              className={`${style.tab} ${
                tab == this.state.currentTab ? style.selected : ""
              }`}
              key={`tab_${tab}`}
              onClick={this.setTab.bind(this, tab)}
            >
              {tab}
            </div>
          ))}
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
}

function TabContent(propsData: IPropsTab): JSX.Element {
  if (propsData.tabName === "Effects") {
    return (
      <EffectView
        effects={propsData.props.effects}
        onEffectAction={propsData.props.onEffectAction}
      />
    );
  } else if (propsData.tabName == "Components") {
    return <ComponentView components={propsData.props.components} />;
  }
  return null;
}

export { StatusView };
