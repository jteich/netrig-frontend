import * as React from "react";
import ReceiveAudio from "./ReceiveAudio";
import jquery from "jquery";

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
        jquery.ajax("/radio/audioOutDevices")
            .then((response: AudioCard[]) => {this.setState({audioCards: response});})
            .fail((err: any) => {console.error(err);});
    }

    render() {
        let host = window.location.host;
        let audioCards: AudioCard[] = [];
        return <div>
            <h1>Radio Test!</h1>
            <select>
                {audioCards.map((audioCard)=>{
                    return <option value={audioCard.name}>{audioCard.name + ':' + audioCard.desc}</option>;
                })}
            </select>
            <ReceiveAudio url={"ws://" + host + "/radio/audioOut"}></ReceiveAudio>
        </div>
    }
}
export default App;
