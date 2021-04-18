import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "./Socket";

export const PlayerCheckContext = React.createContext()
const usePlayerCheck = () => {
    const [playerStatus, setPlayerStatus] = useState(null);
    const socket = useContext(SocketContext);

    const handlePlayerCheckAck = (data) => {
        setPlayerStatus(data.status);
        console.log(data.status);
    }
    useEffect(() => {
        socket.on("PLAYER_CHECK_ACK", handlePlayerCheckAck);

    },[socket])
    
    return playerStatus;
}
 
export default usePlayerCheck;