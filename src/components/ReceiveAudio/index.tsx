import * as React from "react";

export interface ReceiveAudioProps { url: string; }
interface AudioStreamConfig {samplesPerSecond: number; bitsPerSample: number;}

class ReceiveAudio extends React.Component<ReceiveAudioProps, any> {
    connection: WebSocket;
    audioStreamConfig: AudioStreamConfig;

    constructor(props: ReceiveAudioProps) {
        super(props);
        this.initiateConnection();
    };

    initiateConnection(){
        let connection = new WebSocket(this.props.url);
        this.connection = connection;

        //connection.binaryType
        connection.onopen = () => {console.log("ReceiveAutdio connected");};
        connection.onclose = () => {console.log("ReceiveAutdio connection closed");};
        connection.onmessage = this.initiateAudio;
    };

    initiateAudio(msg: MessageEvent){
        console.log("WebSocket message received:", msg);
        console.log(msg);
        this.connection.onmessage = this.pushAudioOut;
    }

    pushAudioOut(msg: MessageEvent){
        //todo
    };

    render() {
        return <div>audio</div>;
    };
}
export default ReceiveAudio;