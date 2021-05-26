import * as React from "react";

import style from "../less/pdfViewer.module.less";

class PdfViewer extends React.PureComponent<{ script: string }> {
  constructor(props: { script: string }) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className={style.container}>
        <div className={style.textArea}>{this.props.script}</div>
      </div>
    );
  }
}

export { PdfViewer };
