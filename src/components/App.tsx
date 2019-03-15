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
};

class App extends React.Component<any, State> {
    constructor(props: Props){
        super(props)
        this.state = { audioCards: [] };
    }

    componentDidMount(){
        jQuery.ajax("/radio/audioOutDevices")
            .then((response: AudioCard[]) => {this.setState({audioCards: response});})
            .fail((err: any) => {console.error(err);});
    }

    handleAudioDeviceChange(event: React.ChangeEvent){
        console.log(event);
    }

    render() {
        let host = window.location.host;
        return <div>
            <h1>Radio Test!</h1>
            <select onChange={this.handleAudioDeviceChange}>
                {
                    this.state.audioCards.map((audioCard)=>
                        <option value={audioCard.name}>{audioCard.name + ':' + audioCard.desc}</option>
                    )
                }
            </select>
            <ReceiveAudio url={"ws://" + host + "/radio/audioOut"}></ReceiveAudio>
        </div>
    }
}
export default App;
