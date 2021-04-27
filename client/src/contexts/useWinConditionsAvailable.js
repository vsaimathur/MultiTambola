import React, {useContext, useState, useEffect} from 'react';
import { SocketContext } from "./Socket";

export const WinConditionsAvailableContext = React.createContext();
const useWinConditionsAvailable = () => {

    const socket = useContext(SocketContext);
    const [winConditionsAvailableStatus, setWinConditionsAvailableStatus] = useState({
        earlyFive: true,
        topRow: true,
        middleRow: true,
        lastRow: true,
        fullHousie: true
    });

    const [winDisplayStatus, setWinDisplayStatus] = useState(false);
    const [lastWinConditionUpdated, setLastWinConditionUpdated] = useState(false);

    const handleWinConditionsAvailableStatus = (data) => {
        setWinConditionsAvailableStatus(data.curWinConditionsAvailable);
        //checking if any key has some name as value, i.e somebody completed winCondition
        setLastWinConditionUpdated((prevVal) => {
            if(prevVal !== data.lastWinConditionUpdated) {
                setWinDisplayStatus(true);
                return data.lastWinConditionUpdated
            }
            else return prevVal;
        })
    }

    useEffect(() => {

        //[***NOT YET USED AS MID CLIENT JOIN FEATURE IS NOT IMPLEMENTED YET] 
        //this feature is for letting the client who joined in the middle of game to let know about the current winConditionsAvailable 
        //when client/ player joins rooms we emit this event once so that winCondtions get updated according to status in room.
        // socket.emit("WIN_CONDITIONS_AVAILABLE_STATUS_REQ");

        socket.on("WIN_CONDITIONS_AVAILABLE_STATUS", handleWinConditionsAvailableStatus);

        return () => socket.off("WIN_CONDITIONS_AVAILABLE_STATUS", handleWinConditionsAvailableStatus);
    }, [socket])

    return {winConditionsAvailableStatus, winDisplayStatus, setWinDisplayStatus, lastWinConditionUpdated};
}
 
export default useWinConditionsAvailable;