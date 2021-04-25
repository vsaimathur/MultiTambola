import React, {useContext, useEffect, useState} from 'react';
import {SocketContext} from "./Socket";

export const PointTrackerContext = React.createContext();
const usePointTracker = () => {
    const socket = useContext(SocketContext);
    const [pointsLive, setPointsLive] = useState(5);

    const handlePlayerPointsAck = (data) => {
        console.log(data.points);
        setPointsLive(data.points);
    }
    useEffect(() => {
        socket.on("PLAYER_POINTS_ACK", handlePlayerPointsAck);

        return () => socket.off("PLAYER_POINTS_ACK", handlePlayerPointsAck);
    }, [socket])
    
    return {pointsLive, setPointsLive};
}

export default usePointTracker;