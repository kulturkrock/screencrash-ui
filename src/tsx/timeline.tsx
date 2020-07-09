import * as React from "react";

import { INodeCollection, IEmpty } from "./types";
import style from "../less/timeline.module.less";

class Timeline extends React.PureComponent<
  { nodes: INodeCollection; currentNode: string },
  IEmpty
> {
  public render(): JSX.Element {
    return (
      <div className={style.container}>
        {Object.entries(this.props.nodes).map(([key, node]) => {
          let classes = style.textArea;
          if (key === this.props.currentNode) {
            classes = `${classes} ${style.selectedText}`;
          }
          return (
            <div key={key} className={classes}>
              {node.prompt}
            </div>
          );
        })}
      </div>
    );
  }
}

export { Timeline };
