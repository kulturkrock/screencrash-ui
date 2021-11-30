import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  DummyCoreConnection,
  RealCoreConnection,
  ICoreConnection,
} from "./coreConnection";
import { LiveScreen } from "./liveScreen";
import { IEmpty } from "./types";
import style from "../less/main.module.less";

interface IState {
  coreAddress: string;
  coreConnection: ICoreConnection;
}

class Main extends React.PureComponent<IEmpty, IState> {
  constructor(props: IEmpty) {
    super(props);
    const queryParams = new URLSearchParams(window.location.search);
    const coreAddress = queryParams.get("core");
    this.state = {
      coreAddress,
      coreConnection: this.getCoreConnection(coreAddress),
    };
  }

  public render() {
    return (
      <div className={style.gridContainer}>
        <div className={style.header}>
          <div>Mode: Live</div>
          <div>
            <form>
              <label>Core: </label>
              <input
                className={style.addressInput}
                autoComplete="off"
                type="text"
                name="core"
                defaultValue={this.state.coreAddress}
              />
            </form>
          </div>
        </div>
        <div className={style.screen}>
          <LiveScreen coreConnection={this.state.coreConnection} />
        </div>
      </div>
    );
  }

  private getCoreConnection(address: string) {
    if (address === "fake") {
      return new DummyCoreConnection(address);
    } else {
      return new RealCoreConnection(address);
    }
  }
}

ReactDOM.render(<Main />, document.getElementById("super-container"));
