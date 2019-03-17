import * as React from "react";

interface State {
    running: boolean;
}

const RATE = 44100;
const DURATION = 5;
const FREQ = 400; //hz

class ToneTest extends React.Component<any, State> {
    audioCtx: AudioContext;
    blockCount = 0;
    nextTime = 0;

    constructor(props: any) {
        super(props);

        this.state = { running: false };
    }

    sendTone() {
        if(this.audioCtx === null){
            this.audioCtx = new AudioContext();
        }

        let buffer = this.audioCtx.createBuffer(1, RATE * DURATION, RATE);
        let channel = buffer.getChannelData(0); 
        const constant = FREQ * 2 * Math.PI/ RATE;
        for (let i = 0; i < buffer.length; i++) {
            channel[i] = Math.sin( i * constant);
        }
        const source = this.audioCtx.createBufferSource();

        source.buffer = buffer;

        source.connect(this.audioCtx.destination);

        source.start();
    }

    stop(){
        this.setState({running: false});
    }

    start(){
        this.setState({running: true});
        this.sendTone();
    }

    render() {
        //return {this.state.running ?  <input type="button" value="stop" onClick={() => this.stop()} /> :  <input type="button" value="stop" onClick={() => this.stop()} />;
        return <input type="button" value={this.state.running ? "Stop" : "Start"} onClick={() => this.state.running ?  this.stop() : this.start()} />;
    }
}
export default ToneTest;