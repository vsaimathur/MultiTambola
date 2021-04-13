import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "./Socket";

export const PlayerNamesContext = React.createContext();

const usePlayerNames = () => {

    const socket = useContext(SocketContext);
    const [roomPlayerNames, setRoomPlayerNames] = useState([]);


    const handlePlayerNames = (data) => {
        setRoomPlayerNames(data.roomPlayerNames)
        console.log(roomPlayerNames);
    }

    useEffect(() => {

        socket.on("ROOM_PLAYER_NAMES", handlePlayerNames);

        return () => socket.off("ROOM_PLAYER_NAMES", handlePlayerNames);

    }, [socket])

    return roomPlayerNames;
}

export default usePlayerNames;