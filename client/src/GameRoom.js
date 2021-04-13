import { SocketContext } from "./contexts/Socket";
import { useContext, useEffect } from "react";
import LiveNumGen from "./LiveNumGen";
import Tickets from "./Tickets";
import PlayersDisplayList from "./PlayersDisplayList";

const GameRoom = () => {

    return (
        <>
            <LiveNumGen />
            <Tickets />
            <PlayersDisplayList />
        </>
        );
}

export default GameRoom;