import React, {useContext, useEffect, useState} from "react";
import {SocketContext} from './Socket';

export const RoomBoardDataLiveContext = React.createContext();
const useRoomBoardDataLive = () => {
    const socket = useContext(SocketContext);
    const [roomBoardDataLive, setRoomBoardDataLive] = useState([]);

    const handleBoardDataAck = (data) => {
        console.log(data.liveBoardData);
        setRoomBoardDataLive(data.liveBoardData);
    }
    useEffect(() => {
        socket.on("BOARD_DATA_ACK", handleBoardDataAck);
        return () => socket.off("BOARD_DATA_ACK");
    })
    return {roomBoardDataLive};
}
 
export default useRoomBoardDataLive;