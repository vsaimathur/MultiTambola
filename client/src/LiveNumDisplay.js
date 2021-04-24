import { useContext, useEffect, useState } from 'react';
import { SocketContext } from './contexts/Socket';
import { PlayerCheckContext } from './contexts/usePlayerCheck';
import { LiveNumGenContext } from './contexts/useLiveNumGen';
import { Button, Switch, Typography } from '@material-ui/core';
import useInterval from "./useInterval";

const LiveNumDisplay = () => {

    const socket = useContext(SocketContext);
    const playerStatus = useContext(PlayerCheckContext);
    const { curLiveNumGen, prevLiveNumGen, sequenceNumber } = useContext(LiveNumGenContext);

    const [generateButtonClicked, setGenerateButtonClicked] = useState(false);
    const [switchStateOn, setSwitchStateOn] = useState(false);
    const EMIT_TIME_INTERVAL = 6000; //6sec

    const handleGenerateButtonClicked = () => {
        setGenerateButtonClicked(true);
    }

    const handleEmitTimeBasedInterval = () => {
        console.log(1);
        socket.emit("LIVE_NUM_GEN_REQ", {
            sequenceNumber
        });
    }
    const handleSwitchStateChanged = () => {
        setSwitchStateOn((prevState) => !prevState);
    }
    
    //As host left only way to continue game is to make timer button on.
    const handleHostLeft = () => {
        console.log("host-left-switch-on");
        setSwitchStateOn(true);
    }

    //for Host Check emit event, as if kept other useEffect, It will get emitted many no. of times as and when button is clicked.
    useEffect(() => {
        //checking if this socket is host or not by emitting HOST_CHECK_REQ event, which is then handled by HostCheckContext.
        socket.emit("PLAYER_CHECK_REQ");
    }, [socket])

    // if switch is on then, this hook useInterval sets given amount of interval and also takes care of clearing it.
    useInterval(handleEmitTimeBasedInterval, switchStateOn ? EMIT_TIME_INTERVAL : null);

    useEffect(() => {
        console.log(switchStateOn);
        if (generateButtonClicked && !switchStateOn) {
            console.log(1);
            socket.emit("LIVE_NUM_GEN_REQ", {
                sequenceNumber
            })
        }
    }, [generateButtonClicked, switchStateOn, socket])

    useEffect(() => {
        setGenerateButtonClicked(false);
    }, [curLiveNumGen, prevLiveNumGen]);

    useEffect(() => {
        socket.on("HOST_LEFT", handleHostLeft);

        return () => socket.off("HOST_LEFT", handleHostLeft);
    },[socket]);

    return (
        <>
            <Typography variant="h2" color="secondary">{curLiveNumGen}</Typography>
            <Typography variant="h5" color="primary">{prevLiveNumGen}</Typography>
            {playerStatus === 0 && <Button variant="contained" color="primary" onClick={handleGenerateButtonClicked}>Generate</Button>}
            {playerStatus === 0 && <Switch checked={switchStateOn} onChange={handleSwitchStateChanged} inputProps={{ 'aria-label': 'secondary checkbox' }} />}
        </>
    );
}

export default LiveNumDisplay;