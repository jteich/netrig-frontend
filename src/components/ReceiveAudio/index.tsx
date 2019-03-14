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
        connection.onmessage = this.processAudio;
    };

    processAudio(msg: MessageEvent){
        if(this.audioStreamConfig == null){
            console.log("WebSocket message received:", msg);
            console.log(msg);
            console.log(msg.data);
            //let configData = msg.data.slice(0,8);
            let data = new Int32Array(msg.data);
            //let { samplesPerSecond, bitsPerSample } = {data[0], data[1]};
            this.audioStreamConfig ={  samplesPerSecond: data[0], bitsPerSample: data[1]};
            console.log("Audion setup: ", this.audioStreamConfig);
        }
    }

    render() {
        return <div>audio</div>;
    };
}
export default ReceiveAudio;