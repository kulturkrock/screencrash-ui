import * as React from "react";
import { IComponentInfo, IEmpty } from "./types";

import style from "../less/componentView.module.less";

interface IProps {
  components: IComponentInfo[];
  onReset: (componentId: string) => void;
  onRestart: (componentId: string) => void;
}

interface IState {
  resetActivated: string[];
  restartActivated: string[];
}

class ComponentView extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      resetActivated: [],
      restartActivated: [],
    };
  }

  public render(): JSX.Element {
    return (
      <div>
        {this.props.components.map((comp) => (
          <div
            className={style.component}
            key={`${comp.componentName}_${comp.componentId}`}
          >
            <div className={style.componentInfo}>
              <div className={style.componentName}>
                {comp.componentId} ({comp.componentName})
              </div>
              <div className={style.componentStatus}>{comp.status}</div>
            </div>
            <div className={style.componentActions}>
              <button
                className={
                  this.state.resetActivated.includes(comp.componentId)
                    ? style.resetButtonEnabled
                    : ""
                }
                onClick={this.onReset.bind(this, comp.componentId)}
              >
                Reset
              </button>
              <button
                className={
                  this.state.restartActivated.includes(comp.componentId)
                    ? style.restartButtonEnabled
                    : ""
                }
                onClick={this.onRestart.bind(this, comp.componentId)}
              >
                Restart
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  private onReset(componentId: string) {
    if (this.state.resetActivated.includes(componentId)) {
      if (this.props.onReset) {
        this.props.onReset(componentId);
      }
      this.deactivateResetFor(componentId);
    } else {
      this.setState({
        resetActivated: [...this.state.resetActivated, componentId],
      });
      setTimeout(this.deactivateResetFor.bind(this, componentId), 2000);
    }
  }

  private deactivateResetFor(componentId: string) {
    this.setState({
      resetActivated: this.state.resetActivated.filter(
        (comp) => comp != componentId,
      ),
    });
  }

  private onRestart(componentId: string) {
    if (this.state.restartActivated.includes(componentId)) {
      if (this.props.onRestart) {
        this.props.onRestart(componentId);
      }
      this.deactivateRestartFor(componentId);
    } else {
      this.setState({
        restartActivated: [...this.state.restartActivated, componentId],
      });
      setTimeout(this.deactivateRestartFor.bind(this, componentId), 2000);
    }
  }

  private deactivateRestartFor(componentId: string) {
    this.setState({
      restartActivated: this.state.restartActivated.filter(
        (comp) => comp != componentId,
      ),
    });
  }
}

export { ComponentView };
