import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";

let anchor = document.createElement("DIV");
anchor.id = "app";
document.getElementsByTagName("body")[0].appendChild(anchor);

ReactDOM.render(
    <App />,
    document.getElementById("app")
);