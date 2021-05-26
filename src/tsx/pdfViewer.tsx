import * as React from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

import style from "../less/pdfViewer.module.less";

class PdfViewer extends React.PureComponent<{ script: string }> {
  constructor(props: { script: string }) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className={style.container}>
        <Document file={this.props.script}>
          <Page pageNumber={1} />
        </Document>
      </div>
    );
  }
}

export { PdfViewer };
