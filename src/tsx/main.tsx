import * as React from "react";
import * as ReactDOM from "react-dom";
import { DummyCoreConnection } from "./coreConnection";
import { LiveScreen } from "./liveScreen";

import style from "../less/main.module.less";


const coreConnection = new DummyCoreConnection();
const liveScreen = <LiveScreen coreConnection={coreConnection}/>;

ReactDOM.render(
    <div className={style.gridContainer}>
        <div className={style.header}>
            <div>Mode: Live</div>
            <div>Placeholder</div>
        </div>
        <div className={style.screen}>{liveScreen}</div>
    </div>,
    document.getElementById("super-container"));
