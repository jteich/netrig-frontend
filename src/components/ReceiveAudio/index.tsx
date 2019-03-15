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
        connection.onopen = () => {console.log("ReceiveAudio connected");};
        connection.onclose = () => {console.log("ReceiveAudio connection closed");};
        connection.binaryType = "arraybuffer";
        connection.onmessage = this.processAudio;
    };

    processAudio(msg: MessageEvent){
        if(this.audioStreamConfig == null){
            console.log("WebSocket message received:", msg);
            console.log(msg);
            console.log(msg.data);

            /*
            var reader = new FileReader();
            reader.addEventListener("loadend", function() {
            // reader.result contains the contents of blob as a typed array
                console.log("filereader got:", reader.result);
                let data = new Int32Array(msg.data);
                console.log("cast to i32:", data);
            });
            reader.readAsArrayBuffer(msg.data);
            */

            let data = new Int32Array(msg.data);
            this.audioStreamConfig = { samplesPerSecond: data[0], bitsPerSample: data[1] };
            console.log("Audio setup: ", this.audioStreamConfig);
        }
    }

    render() {
        return <div>audio</div>;
    };
}
export default ReceiveAudio;