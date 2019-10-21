import * as React from "react";
import * as ReactDOM from "react-dom";
import { LiveScreen } from "./liveScreen";

import style from "../less/main.module.less";

const liveScreen = <LiveScreen/>;

ReactDOM.render(
    <div className={style.gridContainer}>
        <div className={style.header}>
            <div>Mode: Live</div>
            <div>Placeholder</div>
        </div>
        <div className={style.screen}>{liveScreen}</div>
    </div>,
    document.getElementById("super-container"));
