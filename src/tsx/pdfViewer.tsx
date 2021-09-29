import * as React from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

import style from "../less/pdfViewer.module.less";

interface IState {
  id: string;
  pdfWidth: number;
  numPages: number;
}

class PdfViewer extends React.PureComponent<{ script: string }, IState> {
  constructor(props: { script: string }) {
    super(props);
    // Create a random ID, to avoid collisions if we ever have multiple
    // PDF viewers.
    this.state = {
      id: `pdfViewer${Math.round(Math.random() * 10000000)}`,
      pdfWidth: 0,
      numPages: 0,
    };
  }

  public componentDidMount(): void {
    const { width } = document
      .getElementById(this.state.id)
      .getBoundingClientRect();
    // This will only grow the container, never shrink it.
    // Since we only do it when mounting it's fine for now.
    this.setState({
      pdfWidth: width,
    });
  }

  public render(): JSX.Element {
    return (
      <div className={style.container} id={this.state.id}>
        <Document
          file={this.props.script}
          onLoadSuccess={({ numPages }) => {
            this.setState({ numPages });
          }}
        >
          {[...Array(this.state.numPages).keys()].map((index) => (
            <Page
              key={index + 1}
              pageNumber={index + 1}
              width={this.state.pdfWidth}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </div>
    );
  }
}

export { PdfViewer };
