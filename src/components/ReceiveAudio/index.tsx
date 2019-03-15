import * as React from "react";

export interface ReceiveAudioProps { url: string; }
interface AudioStreamConfig {samplesPerSecond: number; bitsPerSample: number;}

class ReceiveAudio extends React.Component<ReceiveAudioProps, any> {
    connection: WebSocket;
    audioStreamConfig: AudioStreamConfig = null;
    audioCtx: AudioContext;
    audioDestination: MediaStreamAudioDestinationNode;
    blockCount = 0;

    constructor(props: ReceiveAudioProps) {
        super(props);

        this.audioCtx = new AudioContext();
        this.audioDestination = this.audioCtx.createMediaStreamDestination();

        this.initiateConnection();
    }

    initiateConnection(){
        let connection = new WebSocket(this.props.url);
        this.connection = connection;

        //connection.binaryType
        connection.onopen = () => {console.log("ReceiveAudio connected");};
        connection.onclose = () => {console.log("ReceiveAudio connection closed");};
        connection.binaryType = "arraybuffer";
        connection.onmessage = (msg: MessageEvent) => this.handleMessage(msg);
    }

    handleMessage(msg: MessageEvent){
        if(this.audioStreamConfig == null){
            this.processAudioConfig(msg);
        } else {
            this.processAudio(msg);
        }
    }

    processAudioConfig(msg: MessageEvent){
        console.log("processAudionConfig");
        console.log("WebSocket message received:", msg);
        /*
        let data = new Int32Array(msg.data);
        this.audioStreamConfig = { samplesPerSecond: data[0], bitsPerSample: data[1] };
        */
        const dataView = new DataView(msg.data);
        for(let i = 0; i< msg.data.byteLength; i++){
            console.log(i, ':', dataView.getInt8(i));
        }
        this.audioStreamConfig = { samplesPerSecond: dataView.getInt32(0, true), bitsPerSample: dataView.getInt32(4, true) };
        console.log("Audio setup: ", this.audioStreamConfig);
    }

    processAudio(msg: MessageEvent) {
        console.log("Processing block: " + (this.blockCount++).toString() );
        /*
        let audioBufferLength = msg.data.length / Int32Array.BYTES_PER_ELEMENT;
        let buffer = this.audioCtx.createBuffer(1, audioBufferLength, this.state.audioStreamConfig.samplesPerSecond);
        let channel = buffer.getChannelData(0);
        for(let i = 0; i < audioBufferLength; i++){
            channel[i] = msg.data[0] + msg.data[1] + msg.data[2] + msg
        }
        */
         //const currentTime = context.currentTime;
        let data = new Int32Array(msg.data);
        let buffer = this.audioCtx.createBuffer(1, data.length, this.audioStreamConfig.samplesPerSecond);
        let channel = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) {
            channel[i] = data[i];
        }
        const source = this.audioCtx.createBufferSource();

        source.buffer = buffer;

        source.connect(this.audioCtx.destination);
        source.start();
        //source.start(nextTime, offset);
        //source.stop(nextTime + duration);
    }

    handleStopClick(){
        this.connection.close();
    }

    render() {
        return <div>audio<input type="button" value="stop" onClick={() => this.handleStopClick} /></div>;
    }
}
export default ReceiveAudio;