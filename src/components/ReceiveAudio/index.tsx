import * as React from "react";

export interface ReceiveAudioProps { url: string; }
interface AudioStreamConfig {samplesPerSecond: number; bitsPerSample: number;}

class ReceiveAudio extends React.Component<ReceiveAudioProps, any> {
    connection: WebSocket;
    audioStreamConfig: AudioStreamConfig = null;
    audioCtx: AudioContext;
    audioDestination: MediaStreamAudioDestinationNode;
    blockCount = 0;
    nextTime = 0;

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

        let dataView = new DataView(msg.data);
        let bytesPerSample = this.audioStreamConfig.bitsPerSample / 8;
        let sampleCount = dataView.byteLength  / bytesPerSample;
        let buffer = this.audioCtx.createBuffer(1, sampleCount, this.audioStreamConfig.samplesPerSecond);
        let channel = buffer.getChannelData(0);
        let devisor = 2^(this.audioStreamConfig.bitsPerSample / 2);
        let func: (byteOffset: number, littleEndian?: boolean) => {};
        switch(this.audioStreamConfig.bitsPerSample){
            case 32:
                func = dataView.getInt32;
                break;
            case 16:
                func = dataView.getInt16;
                break;
            case 8:
                func = dataView.getInt8;
                break;
            //todo handle 24
            default:
                throw "Unkonwn audio bitwidth:" +  this.audioStreamConfig.bitsPerSample;
        }
        for (let i = 0; i < buffer.length; i++) {
            channel[i] = func.call(dataView , i * bytesPerSample, true) / devisor;
        }


        /*
        let data;
        switch(this.audioStreamConfig.bitsPerSample){
            case 32:
                data = new Int32Array(msg.data);
                break;
            case 16:
                data = new Int16Array(msg.data);
                break;
            case 8:
                data = new Int8Array(msg.data);
                break;
            default:
                throw "Unkonwn audio bitwidth:" +  this.audioStreamConfig.bitsPerSample;
        }
        let buffer = this.audioCtx.createBuffer(1, data.length, this.audioStreamConfig.samplesPerSecond);
        let channel = buffer.getChannelData(0);
        let devisor = 2^(this.audioStreamConfig.bitsPerSample / 2);
        for (let i = 0; i < buffer.length; i++) {
            channel[i] = data[i] / devisor;
        }
        */


        const source = this.audioCtx.createBufferSource();

        source.buffer = buffer;

        source.connect(this.audioCtx.destination);

        const duration = sampleCount / this.audioStreamConfig.samplesPerSecond;
        let thisTime: number;
        if(this.nextTime == 0){
            thisTime = this.audioCtx.currentTime + duration;
            //this.nextTime = this.audioCtx.currentTime + 2 * duration;
        } else {
            thisTime = this.nextTime;
        }
        this.nextTime = thisTime + duration;

        source.start(thisTime);
        //source.start(nextTime, offset);
        //source.stop(nextTime + duration);
    }

    handleStopClick(){
        this.connection.close();
    }

    render() {
        return <div>audio<input type="button" value="stop" onClick={() => this.handleStopClick()} /></div>;
    }
}
export default ReceiveAudio;