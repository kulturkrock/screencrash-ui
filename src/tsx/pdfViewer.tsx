import * as React from "react";

import { IEmpty } from "./types";
import style from "../less/pdfViewer.module.less";

interface IState {
  text: string;
}

class PdfViewer extends React.PureComponent<IEmpty, IState> {
  constructor(props: IEmpty) {
    super(props);
    this.state = { text: "Jag är en PDF-läsare" };
  }

  public render(): JSX.Element {
    return (
      <div className={style.container}>
        <div className={style.textArea}>{this.state.text}</div>
      </div>
    );
  }
}

export { PdfViewer };
