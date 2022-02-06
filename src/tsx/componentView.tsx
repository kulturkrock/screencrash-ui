import * as React from "react";
import { IComponentInfo, IEmpty } from "./types";

import style from "../less/componentView.module.less";

interface IProps {
  components: IComponentInfo[];
  onReset: (componentId: string) => void;
  onRestart: (componentId: string) => void;
}

class ComponentView extends React.PureComponent<IProps, IEmpty> {
  constructor(props: IProps) {
    super(props);
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
              <button onClick={this.onReset.bind(this, comp.componentId)}>
                Reset
              </button>
              <button onClick={this.onRestart.bind(this, comp.componentId)}>
                Restart
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  private onReset(componentId: string) {
    if (this.props.onReset) {
      this.props.onReset(componentId);
    }
  }

  private onRestart(componentId: string) {
    if (this.props.onRestart) {
      this.props.onRestart(componentId);
    }
  }
}

export { ComponentView };
