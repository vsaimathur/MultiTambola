import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from "./Socket";

export const LiveNumGenContext = React.createContext();

const useLiveNumGen = () => {
    const socket = useContext(SocketContext);

    const [sequenceNumber, setSequenceNumber] = useState(0);
    const [curLiveNumGen, setCurLiveNumGen] = useState();
    const [prevLiveNumGen, setPrevLiveNumGen] = useState();

    const handleLiveBoardSequenceGenAck = (data) => {
        setSequenceNumber(prevSequenceNumber => (prevSequenceNumber + 1));
        setCurLiveNumGen(data.curNumGen);
        setPrevLiveNumGen(data.prevNumGen);
    }

    useEffect(() => {

        socket.on("LIVE_NUM_GEN_ACK", handleLiveBoardSequenceGenAck);

        return () => socket.off("LIVE_NUM_GEN_ACK", handleLiveBoardSequenceGenAck);

    }, [socket])

    return { sequenceNumber, curLiveNumGen, prevLiveNumGen };
}

export default useLiveNumGen;