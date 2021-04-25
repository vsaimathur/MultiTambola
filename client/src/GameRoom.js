import LiveNumDisplay from "./LiveNumDisplay";
import Tickets from "./Tickets";
import PlayersDisplayList from "./PlayersDisplayList";
import WinCombo from './WinCombo';
import { useContext, useEffect } from "react";
import { WinConditionsAvailableContext } from "./contexts/useWinConditionsAvailable";
import { useHistory } from 'react-router-dom';
import ShowBoard from "./ShowBoard";
import PointsDisplay from "./PointsDisplay";

const GameRoom = () => {

    const history = useHistory();
    const { winConditionsAvailableStatus } = useContext(WinConditionsAvailableContext);

    //code for redirecting to podium room when game finishes!.
    useEffect(() => {
        console.log(winConditionsAvailableStatus);
        if (winConditionsAvailableStatus && !(winConditionsAvailableStatus["fullHousie"] === true)) {
            history.push("/podiumroom");
        }
    }, [winConditionsAvailableStatus])

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div style={{ border: "2px solid red", padding: "10vh" }}>
                <div style={{ float: "right" }}><PointsDisplay /></div>
                <LiveNumDisplay />
                <br />
                <PlayersDisplayList />
                <ShowBoard />
                <Tickets />
                <div className="d-flex justify-content-center">
                    <div>
                        <WinCombo />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameRoom;