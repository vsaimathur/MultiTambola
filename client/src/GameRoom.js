import {SocketContext} from "./Socket";
import { useContext, useEffect } from "react";

const GameRoom = () => {

    const socket = useContext(SocketContext)

    useEffect(() => {
        socket.emit("GAME_START");

    }, [socket])
    return (
        <>
            <p>Game Page!</p>
        </>);
    }

export default GameRoom;    