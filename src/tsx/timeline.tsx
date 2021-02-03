import * as React from "react";
import * as d3 from "d3";

import { INodeCollection } from "./types";
import style from "../less/timeline.module.less";

const VIEWBOX_WIDTH = 200;
const LEFT_MARGIN = 30;
const TOP_MARGIN = -40;

const NODE_SPACING = 40;
const NODE_RADIUS = 5;

const NODES_BEFORE = 3;

const CURRENT_NODE_FILL = "wheat";
const BACKGROUND_COLOR = "rgb(75, 14, 14)";

interface IProps {
  nodes: INodeCollection;
  history: string[];
}

interface IState {
  id: string;
  viewboxHeight: number;
}

class Timeline extends React.PureComponent<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    // Create a random ID, to avoid collisions if we ever have multiple
    // timelines.
    this.state = {
      id: `timeline${Math.round(Math.random() * 10000000)}`,
      viewboxHeight: 0,
    };
  }

  public componentDidMount(): void {
    this.calculateViewboxHeight();
    this.updateTimeline(this.props.nodes, this.props.history);
  }

  public componentDidUpdate(): void {
    this.updateTimeline(this.props.nodes, this.props.history);
  }

  private calculateViewboxHeight(): void {
    const { height, width } = document
      .getElementById(this.state.id)
      .getBoundingClientRect();
    console.log(height);
    console.log(width);
    // This will only grow the viewbox, never shrink it.
    // Since we only do it when mounting it's fine for now.
    this.setState({
      viewboxHeight: (height - 2) * (VIEWBOX_WIDTH / (width - 2)),
    });
    console.log(height * (VIEWBOX_WIDTH / width));
  }

  public updateTimeline(nodes: INodeCollection, history: string[]): void {
    // Enough nodes after that the last is out of view
    const nodesAfter =
      Math.round((this.state.viewboxHeight - TOP_MARGIN) / NODE_SPACING) -
      NODES_BEFORE +
      1;
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
      for (let step = 0; step < nodesAfter; step++) {
        const nextId = visibleNodes[visibleNodes.length - 1].next;
        if (nextId !== undefined) {
          visibleNodes.push({ id: nextId, tense: "future", ...nodes[nextId] });
        }
      }
    }
    const pastNodes = visibleNodes.filter(({ tense }) => tense === "past")
      .length;
    const nodesWithPosition = visibleNodes.map((node, index) => ({
      distanceFromStart: Math.max(history.length - NODES_BEFORE - 1, 0) + index,
      x: LEFT_MARGIN,
      y: TOP_MARGIN + (index + NODES_BEFORE - pastNodes) * NODE_SPACING,
      ...node,
    }));
    // Add lines between the nodes
    const lines: {
      id: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }[] = [];
    nodesWithPosition.forEach((node) => {
      const nextNode = nodesWithPosition.find(
        ({ id, distanceFromStart }) =>
          id === node.next && distanceFromStart === node.distanceFromStart + 1,
      );
      if (nextNode) {
        lines.push({
          id: `${node.id}:${node.distanceFromStart}-${nextNode.id}:${nextNode.distanceFromStart}`,
          startX: node.x,
          startY: node.y,
          endX: nextNode.x,
          endY: nextNode.y,
        });
      }
    });
    const transition = d3.transition().duration(300).ease(d3.easeQuadOut);
    // Draw the lines
    d3.select(`#${this.state.id}`)
      .select("svg")
      .selectAll("line")
      .data(lines, ({ id }) => id)
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("x1", ({ startX }) => startX)
            .attr("y1", ({ startY }) => startY)
            .attr("x2", ({ endX }) => endX)
            .attr("y2", ({ endY }) => endY)
            .classed(style.line, true)
            .lower(),
        (update) => {
          update
            .transition(transition)
            .attr("x1", ({ startX }) => startX)
            .attr("y1", ({ startY }) => startY)
            .attr("x2", ({ endX }) => endX)
            .attr("y2", ({ endY }) => endY);
          return update;
        },
      );
    // Then draw the nodes
    d3.select(`#${this.state.id}`)
      .select("svg")
      .selectAll("g")
      .data(
        nodesWithPosition,
        // Construct a unique ID from the actual node ID and its distance from
        // the starting point, to let d3 keep track of nodes between updates.
        // We cannot use the actual ID since nodes can repeat.
        // Once we can have branching paths, this may have to refined further.
        ({ id, distanceFromStart }) => `${id}:${distanceFromStart}`,
      )
      .join(
        (enter) => {
          const g = enter.append("g");
          g.append("circle")
            .attr("cx", ({ x }) => x)
            .attr("cy", ({ y }) => y)
            .attr("r", NODE_RADIUS)
            .classed(style.node, true)
            .classed(style.currentNode, ({ tense }) => tense === "present")
            .attr("fill", ({ tense }) =>
              tense === "present" ? CURRENT_NODE_FILL : BACKGROUND_COLOR,
            );
          g.append("foreignObject")
            .attr("x", ({ x }) => x + NODE_RADIUS)
            .attr("y", ({ y }) => y - NODE_SPACING / 2)
            .attr("width", ({ x }) => VIEWBOX_WIDTH - x - NODE_RADIUS)
            .attr("height", NODE_SPACING)
            .append("xhtml:div")
            .classed(style.promptText, true)
            .text(({ prompt }) => prompt);
          return g;
        },
        (update) => {
          update
            .select("circle")
            .classed(style.currentNode, ({ tense }) => tense === "present")
            .transition(transition)
            .attr("cx", ({ x }) => x)
            .attr("cy", ({ y }) => y)
            .attr("fill", ({ tense }) =>
              tense === "present" ? CURRENT_NODE_FILL : BACKGROUND_COLOR,
            );
          update
            .select("foreignObject")
            .transition(transition)
            .attr("x", ({ x }) => x + NODE_RADIUS)
            .attr("y", ({ y }) => y - NODE_SPACING / 2);
          return update;
        },
      );
  }

  public render(): JSX.Element {
    return (
      <div className={style.container} id={this.state.id}>
        <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${this.state.viewboxHeight}`}></svg>
      </div>
    );
  }
}

export { Timeline };
