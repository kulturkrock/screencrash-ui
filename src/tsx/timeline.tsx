import * as React from "react";
import * as d3 from "d3";

import { INodeCollection } from "./types";
import style from "../less/timeline.module.less";

const VIEWBOX_WIDTH = 200;
const NODE_SPACING = 30;
const NODE_RADIUS = 5;

const NODES_BEFORE = 3;
const NODES_AFTER = 3;

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
    // Show the recent history
    const visibleNodes = history
      .slice(-NODES_BEFORE - 1, -1)
      .map((id) => ({ id, tense: "past", ...nodes[id] }));

    if (history.length > 0) {
      // Show the current node
      const currentId = history[history.length - 1];
      visibleNodes.push({
        id: currentId,
        tense: "present",
        ...nodes[currentId],
      });
      // Show a few nodes into the future
      for (let step = 0; step < NODES_AFTER; step++) {
        const nextId = visibleNodes[visibleNodes.length - 1].next;
        visibleNodes.push({ id: nextId, tense: "future", ...nodes[nextId] });
      }
    }

    const nodesWithPosition = visibleNodes.map((node, index) => ({
      // Construct a unique ID from the actual node ID and its distance from
      // the starting point, to let d3 keep track of nodes between updates.
      // We cannot use the actual ID since nodes can repeat.
      // Once we can have branching paths, this may have to refined further.
      uniqueId: `${node.id}:${
        Math.max(history.length - NODES_BEFORE - 1, 0) + index
      }`,
      x: VIEWBOX_WIDTH / 2,
      y: NODE_SPACING / 2 + index * NODE_SPACING,
      ...node,
    }));

    d3.select(`#${this.state.id}`)
      .select("svg")
      .selectAll("g")
      .data(nodesWithPosition, ({ uniqueId }) => uniqueId)
      .join(
        (enter) => {
          const g = enter.append("g");
          g.append("circle")
            .attr("cx", ({ x }) => x)
            .attr("cy", ({ y }) => y)
            .attr("r", NODE_RADIUS)
            .classed(style.node, true)
            .classed(style.currentNode, ({ tense }) => tense === "present");
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
        (update) => {
          update
            .select("circle")
            .attr("cx", ({ x }) => x)
            .attr("cy", ({ y }) => y)
            .classed(style.currentNode, ({ tense }) => tense === "present");
          update
            .select("foreignObject")
            .attr("x", ({ x }) => x + NODE_RADIUS)
            .attr("y", ({ y }) => y - NODE_SPACING / 2);
          return update;
        },
      );
  }

  public render(): JSX.Element {
    return (
      <div className={style.container} id={this.state.id}>
        <svg viewBox={`0 0 ${VIEWBOX_WIDTH} 350`}></svg>
      </div>
    );
  }
}

export { Timeline };
