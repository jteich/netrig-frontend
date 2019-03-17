import * as React from "react";
import ReceiveAudio from "./ReceiveAudio";
import ToneTest from "./ToneTest";
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
    selectedAudioOutputCard: string;
};

class App extends React.Component<any, State> {
    constructor(props: Props){
        super(props)
        this.state = { audioCards: [], start: false, selectedAudioOutputCard: null };
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
        this.setState({selectedAudioOutputCard: selectedDevice});
    }

    render() {
        let host = window.location.host;
        return <div>
            <h1>Radio Test!</h1>
            <select onChange={(event) => this.handleAudioDeviceChange(event)}>
                {
                    this.state.audioCards.map((audioCard)=>
                        <option key={audioCard.name} value={audioCard.name}>{audioCard.name + ':' + audioCard.desc}</option>
                    )
                }
            </select>
            <input type="button" onClick={() => this.setState({start: true})} value="Start" />
            {this.state.start && <ReceiveAudio url={"ws://" + host + "/radio/audioOut/" + encodeURIComponent(this.state.selectedAudioOutputCard)}></ReceiveAudio>}

            <br/>
            <ToneTest />
        </div>
    }
}
export default App;
