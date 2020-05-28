import * as React from "react";

import style from "../less/pdfViewer.module.less";

interface IState {
    text: string;
}

class PdfViewer extends React.PureComponent<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = { text: "Jag är en PDF-läsare" };
  }

  public render() {
    return (
      <div className={style.container}>
          <div className={style.textArea}>{this.state.text}</div>
      </div>
    );
  }
}

export { PdfViewer };
