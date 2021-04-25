import LiveNumDisplay from "./LiveNumDisplay";
import Tickets from "./Tickets";
import PlayersDisplayList from "./PlayersDisplayList";
import WinCombo from './WinCombo';
import { useContext, useEffect } from "react";
import { WinConditionsAvailableContext } from "./contexts/useWinConditionsAvailable";
import {useHistory} from 'react-router-dom';
import ShowBoard from "./ShowBoard";

const GameRoom = () => {

    const history = useHistory();
    const {winConditionsAvailableStatus} = useContext(WinConditionsAvailableContext);

    //code for redirecting to podium room when game finishes!.
    useEffect(() => {
        console.log(winConditionsAvailableStatus);
        if(winConditionsAvailableStatus && !(winConditionsAvailableStatus["fullHousie"] === true)) {
            history.push("/podiumroom");
        }
    },[winConditionsAvailableStatus])

    return (
        <>
            <LiveNumDisplay />
            <ShowBoard />
            <PlayersDisplayList />
            <Tickets />
            <WinCombo />
        </>
        );
}

export default GameRoom;