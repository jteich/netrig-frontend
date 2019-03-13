import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

let anchor = document.createElement("DIV");
anchor.id = "example";
document.getElementsByTagName("body")[0].appendChild(anchor);

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);