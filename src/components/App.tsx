import * as React from "react";
import ReceiveAudio from "./ReceiveAudio";

export const App = () => {
    let host = window.location.host;
    return <div>
        <h1>Hello there zzzz!</h1>
        <ReceiveAudio url="ws://{{host}}/radio/audioOut"></ReceiveAudio>
    </div>
};
