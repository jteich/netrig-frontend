import * as React from "react";
import ReceiveAudio from "./ReceiveAudio";
import * as jQuery from "jquery";

interface AudioCard {
    io: string;
    name: string;
    desc: string;
};

interface Props {

};

interface State{
    audioCards: AudioCard[];
    start: boolean;
};

class App extends React.Component<any, State> {
    constructor(props: Props){
        super(props)
        this.state = { audioCards: [], start: false };
    }

    componentDidMount(){
        jQuery.ajax("/radio/audioOutDevices")
            .then((response: AudioCard[]) => {this.setState({audioCards: response});})
            .fail((err: any) => {console.error(err);});
    }

    handleAudioDeviceChange(event: React.ChangeEvent<HTMLSelectElement>){
        let selectedDevice = event.target.value;
        console.log(selectedDevice);
        jQuery.ajax("/radio/audioDeviceDetails/" + encodeURIComponent(selectedDevice))
            .then((response: string) => console.log(response));
    }

    render() {
        let host = window.location.host;
        return <div>
            <h1>Radio Test!</h1>
            <select onChange={this.handleAudioDeviceChange}>
                {
                    this.state.audioCards.map((audioCard)=>
                        <option key={audioCard.name} value={audioCard.name}>{audioCard.name + ':' + audioCard.desc}</option>
                    )
                }
            </select>
            <input type="button" onClick={() => this.setState({start: true})}>Start</input>
            {this.state.start && <ReceiveAudio url={"ws://" + host + "/radio/audioOut"}></ReceiveAudio>}
        </div>
    }
}
export default App;
