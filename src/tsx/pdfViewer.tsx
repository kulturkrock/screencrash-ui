import * as React from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

import style from "../less/pdfViewer.module.less";

interface IProps {
  script: string;
  currentPage: number;
  currentLocationOnPage: number;
}

interface IState {
  id: string;
  pdfWidth: number;
  pdfHeight: number;
  numPages: number;
  loadedPages: number; // To keep track of when we've fully loaded
}

class PdfViewer extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    // Create a random ID, to avoid collisions if we ever have multiple
    // PDF viewers.
    this.state = {
      id: `pdfViewer${Math.round(Math.random() * 10000000)}`,
      pdfWidth: 0,
      pdfHeight: 0,
      numPages: 0,
      loadedPages: 0,
    };
  }

  public componentDidMount(): void {
    const { width, height } = document
      .getElementById(this.state.id)
      .getBoundingClientRect();
    // This will only grow the container, never shrink it.
    // Since we only do it when mounting it's fine for now.
    this.setState({
      pdfWidth: width,
      pdfHeight: height,
    });
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    if (
      this.props.currentPage !== prevProps.currentPage ||
      this.props.currentLocationOnPage !== prevProps.currentLocationOnPage ||
      (this.state.numPages !== 0 &&
        this.state.loadedPages !== prevState.loadedPages &&
        this.state.loadedPages === this.state.numPages)
    ) {
      this.scrollToLocation(
        this.props.currentPage,
        this.props.currentLocationOnPage,
      );
    }
  }

  private scrollToLocation(page: number, locationOnPage: number): void {
    const pageHeight = this.state.pdfWidth * Math.sqrt(2); // Assume A4 size
    document.getElementById(this.state.id).scrollTo({
      top: (page + locationOnPage) * pageHeight - 0.5 * this.state.pdfHeight,
      behavior: "smooth",
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
              onLoadSuccess={() => {
                this.setState({ loadedPages: this.state.loadedPages + 1 });
              }}
            />
          ))}
        </Document>
      </div>
    );
  }
}

export { PdfViewer };
