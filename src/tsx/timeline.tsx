import * as React from "react";

import style from "../less/timeline.module.less";
import { INodeCollection } from "./types";

class Timeline extends React.PureComponent<{nodes: INodeCollection, currentNode: string}, {}> {

  public render() {
    return (
      <div className={style.container}>
        {Object.entries(this.props.nodes).map(
          ([key, node]) => {
            let classes = style.textArea;
            if (key === this.props.currentNode) {
              classes = `${classes} ${style.selectedText}`;
            }
            return <div key={key} className={classes}>{node.prompt}</div>;
          })}
      </div>
    );
  }
}

export { Timeline };
