import * as React from "react";
import * as ReactDOM from "react-dom";
import { DummyCoreConnection } from "./coreConnection";
import { LiveScreen } from "./liveScreen";

import "../less/main.less";

const coreConnection = new DummyCoreConnection();
const liveScreen = <LiveScreen coreConnection={coreConnection}/>;

ReactDOM.render(liveScreen, document.getElementById("super-container"));
