import * as React from "react";
import * as d3 from "d3";

import { INodeCollection } from "./types";
import style from "../less/timeline.module.less";

const VIEWBOX_WIDTH = 200;
const NODE_SPACING = 30;
const NODE_RADIUS = 5;

interface IProps {
  nodes: INodeCollection;
  history: string[];
}

class Timeline extends React.PureComponent<IProps, { id: string }> {
  public constructor(props: IProps) {
    super(props);
    // Create a random ID, to avoid collisions if we ever have multiple
    // timelines.
    this.state = { id: `timeline${Math.round(Math.random() * 10000000)}` };
  }

  public componentDidMount(): void {
    this.updateTimeline(this.props.nodes, this.props.history);
  }

  public componentDidUpdate(): void {
    this.updateTimeline(this.props.nodes, this.props.history);
  }

  public updateTimeline(nodes: INodeCollection, history: string[]): void {
    const currentNode = history[history.length - 1];
    const visibleNodes = Object.entries(nodes).map(([id, node], index) => ({
      id,
      x: VIEWBOX_WIDTH / 2,
      y: NODE_SPACING / 2 + index * NODE_SPACING,
      ...node,
    }));
    d3.select(`#${this.state.id}`)
      .select("svg")
      .selectAll("g")
      .data(visibleNodes, ({ id }) => id)
      .join(
        (enter) => {
          const g = enter.append("g");
          g.append("circle")
            .attr("cx", ({ x }) => x)
            .attr("cy", ({ y }) => y)
            .attr("r", NODE_RADIUS)
            .classed(style.node, true)
            .classed(style.currentNode, ({ id }) => id === currentNode);
          g.append("foreignObject")
            .attr("x", ({ x }) => x + NODE_RADIUS)
            .attr("y", ({ y }) => y - NODE_SPACING / 2)
            .attr("width", VIEWBOX_WIDTH / 2 - NODE_RADIUS)
            .attr("height", NODE_SPACING)
            .append("xhtml:div")
            .classed(style.promptText, true)
            .text(({ prompt }) => prompt);
          return g;
        },
        (update) =>
          update
            .select("circle")
            .classed(style.currentNode, ({ id }) => id === currentNode),
      );
  }

  public render(): JSX.Element {
    return (
      <div className={style.container} id={this.state.id}>
        <svg viewBox={`0 0 ${VIEWBOX_WIDTH} 200`}></svg>
      </div>
    );
  }
}

export { Timeline };
