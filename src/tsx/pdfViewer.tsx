import * as React from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

import style from "../less/pdfViewer.module.less";

interface IProps {
  script: string;
  currentPage: number;
  currentLocationOnPage: number;
  focusY: number;
  scrollToCurrentLocation: boolean;
}

interface IState {
  id: string;
  pdfWidth: number;
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
      numPages: 0,
      loadedPages: 0,
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

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    const changedLocation =
      this.props.currentPage !== prevProps.currentPage ||
      this.props.currentLocationOnPage !== prevProps.currentLocationOnPage;
    const justFinishedLoading =
      this.state.numPages !== 0 &&
      this.state.loadedPages !== prevState.loadedPages &&
      this.state.loadedPages === this.state.numPages;
    const justEnabledScrolling =
      this.props.scrollToCurrentLocation && !prevProps.scrollToCurrentLocation;
    if (
      this.props.scrollToCurrentLocation &&
      (changedLocation || justFinishedLoading || justEnabledScrolling)
    ) {
      this.scrollToLocation(
        this.props.currentPage,
        this.props.currentLocationOnPage,
      );
    }
  }

  private scrollToLocation(page: number, locationOnPage: number): void {
    // const pageHeight = this.state.pdfWidth * Math.sqrt(2); // Assume A4 size
    const container = document.getElementById(this.state.id);
    const allPages = container.children[0];
    const { height } = allPages.getBoundingClientRect();
    const pageHeight = height / this.state.numPages;
    container.scrollTo({
      top: (page + locationOnPage) * pageHeight - this.props.focusY,
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
