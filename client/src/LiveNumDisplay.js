import { useContext, useEffect, useState } from 'react';
import { SocketContext } from './contexts/Socket';
import { HostCheckContext } from './contexts/useHostCheck';
import { LiveNumGenContext } from './contexts/useLiveNumGen';

const LiveNumDisplay = () => {

    const socket = useContext(SocketContext);
    const hostStatus = useContext(HostCheckContext);
    const { curLiveNumGen, prevLiveNumGen, sequenceNumber } = useContext(LiveNumGenContext);

    const [generateButtonClicked, setGenerateButtonClicked] = useState(false);

    const handleGenerateButtonClicked = () => {
        setGenerateButtonClicked(true);
    }

    //for Host Check emit event, as if kept other useEffect, It will get emitted many no. of times as and when button is clicked.
    useEffect(() => {
        //checking if this socket is host or not by emitting HOST_CHECK_REQ event, which is then handled by HostCheckContext.
        socket.emit("HOST_CHECK_REQ");
    }, [socket])


    useEffect(() => {
        if (generateButtonClicked) {
            console.log(1);
            socket.emit("LIVE_NUM_GEN_REQ", {
                sequenceNumber
            })
        }
    }, [generateButtonClicked, socket])

    useEffect(() => {
        setGenerateButtonClicked(false);
    }, [curLiveNumGen, prevLiveNumGen]);

    return (
        <>
            <div>{curLiveNumGen}</div>
            <div>{prevLiveNumGen}</div>
            {hostStatus && <button className="btn btn-primary" onClick={handleGenerateButtonClicked}>Generate</button>}
        </>
    );
}

export default LiveNumDisplay;