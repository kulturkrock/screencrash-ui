import * as React from "react";
import { IComponentInfo, IEmpty } from "./types";

import style from "../less/componentView.module.less";

interface IProps {
  components: IComponentInfo[];
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
            <div className={style.componentName}>
              {comp.componentId} ({comp.componentName})
            </div>
            <div className={style.componentStatus}>{comp.status}</div>
          </div>
        ))}
      </div>
    );
  }
}

export { ComponentView };
