import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import { TicketsDataContext } from "./contexts/useTicketsData";
import { TicketLiveStatusContext } from "./contexts/useTicketStatusLive";
import { WinConditionsAvailableContext } from "./contexts/useWinConditionsAvailable";
import { Button, Typography } from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear'; // cross symbol
import useTimeout from './useTimeout';

const WinCombo = () => {

    const socket = useContext(SocketContext);

    const { tickets } = useContext(TicketsDataContext);
    const { ticketStatusLive } = useContext(TicketLiveStatusContext);
    const { winConditionsAvailableStatus, winDisplayStatus, setWinDisplayStatus, lastWinConditionUpdated } = useContext(WinConditionsAvailableContext);
    const MAX_CHECK_LIMIT = 3;
    const MAX_WIN_STATUS_DISPLAY_DURATION = 3000; //3sec
    const [winConditionsClickedStatus, setWinConditionsClickedStatus] = useState(false);
    const [winConditionsCheckLimitCount, setWinConditionsCheckLimitCount] = useState({
        earlyFive: 0,
        topRow: 0,
        middleRow: 0,
        lastRow: 0,
        fullHousie: 0
    });
    const [winCondtionsStatus, setWinConditionsStatus] = useState({
        earlyFive: false,
        topRow: false,
        middleRow: false,
        lastRow: false,
        fullHousie: false
    });

    const getFinalStatusCheckTickets = (tickets, ticketStatusLive) => {
        const tempArr = [[[], [], []], [[], [], []]];
        for (let i = 0; i < ticketStatusLive.length; i++) {
            for (let j = 0; j < ticketStatusLive[i].length; j++) {
                for (let k = 0; k < ticketStatusLive[i][j].length; k++) {
                    if (ticketStatusLive[i][j][k]) {
                        tempArr[i][j].push(tickets[i][j][k]);
                    }
                }
            }
        }
        return tempArr;
    }

    // Handled handleWinConditionsButtonClicked event for each button seperately in return only. As Button in material-ui is having an 
    // issue with value attribute and if I handle it here, event.target.value is sometimes giving undefined and sometimes giving correct value. 
    // const handleWinConditionsButtonClicked = (event) => {
    //     setWinConditionsStatus({ ...winCondtionsStatus, [event.target.value]: true });
    //     setWinConditionsClickedStatus(true);
    // }

    const handleWinConditionsCheckAck = (data) => {
        setWinConditionsStatus(data.winConditionsAck);
        setWinConditionsCheckLimitCount(data.winConditionsCheckLimitCount);
        setWinConditionsClickedStatus(false);
        console.log(data.winConditionsCheckLimitCount);
    }

    const handleShowWinConditionCompletedStatus = () => {
        setWinDisplayStatus(false);
    }

    //timeout for hiding the winConditionCompletion status message dialog.
    useTimeout(handleShowWinConditionCompletedStatus, winDisplayStatus ? MAX_WIN_STATUS_DISPLAY_DURATION : null)

    useEffect(() => {

        if (winConditionsClickedStatus) {
            socket.emit("WIN_CONDITIONS_CHECK_REQ", {
                winConditionsCheckReq: winCondtionsStatus,
                ticketData: getFinalStatusCheckTickets(tickets, ticketStatusLive)
            })
        }

        socket.on("WIN_CONDITIONS_CHECK_ACK", handleWinConditionsCheckAck);

        return () => socket.off("WIN_CONDITIONS_CHECK_ACK", handleWinConditionsCheckAck);

    }, [socket, winConditionsClickedStatus])

    return (
        <>
            {winDisplayStatus &&
                <div className="bg-info" style={{ width: "300px", height: "300px", padding: "10vh", position: "absolute", left: "50%", marginLeft: "-150px", top: "50%", marginTop: "-150px" }}>
                    <div className="text-white text-center text-capitalize">
                        <Typography variant="h4">{lastWinConditionUpdated} Completed!</Typography>
                        <br />
                        <br />
                        <Typography variant="body1">{winConditionsAvailableStatus[lastWinConditionUpdated]} won {lastWinConditionUpdated}</Typography>
                    </div>
                </div>
            }
            <Button variant="contained" color="primary" disabled={winConditionsAvailableStatus["earlyFive"] === true && winConditionsCheckLimitCount["earlyFive"] < MAX_CHECK_LIMIT ? false : true} value="earlyFive" onClick={() => {
                setWinConditionsStatus({ ...winCondtionsStatus, "earlyFive": true });
                setWinConditionsClickedStatus(true);
            }}>
                Early Five
            </Button>
            {(winConditionsAvailableStatus["earlyFive"] === true) && winConditionsCheckLimitCount["earlyFive"] !== 0 &&
                <Typography display="inline" className="text-danger">
                    <ClearIcon /> {winConditionsCheckLimitCount["earlyFive"]}/{MAX_CHECK_LIMIT}
                </Typography>
            }
            {!(winConditionsAvailableStatus["earlyFive"] === true) && <Typography display="inline" variant="body1" className="text-success">{winConditionsAvailableStatus["earlyFive"]}</Typography>}
            <br />
            <br />
            <Button variant="contained" color="primary" disabled={winConditionsAvailableStatus["topRow"] === true && winConditionsCheckLimitCount["topRow"] < MAX_CHECK_LIMIT ? false : true} value="topRow" onClick={() => {
                setWinConditionsStatus({ ...winCondtionsStatus, "topRow": true });
                setWinConditionsClickedStatus(true);
            }}>
                Top Row
            </Button>
            {(winConditionsAvailableStatus["topRow"] === true) && winConditionsCheckLimitCount["topRow"] !== 0 &&
                <Typography display="inline" className="text-danger">
                    <ClearIcon /> {winConditionsCheckLimitCount["topRow"]}/{MAX_CHECK_LIMIT}
                </Typography>
            }
            {!(winConditionsAvailableStatus["topRow"] === true) && <Typography display="inline" variant="body1" className="text-success">{winConditionsAvailableStatus["topRow"]}</Typography>}
            <br />
            <br />
            <Button variant="contained" color="primary" disabled={winConditionsAvailableStatus["middleRow"] === true && winConditionsCheckLimitCount["middleRow"] < MAX_CHECK_LIMIT ? false : true} value="middleRow" onClick={() => {
                setWinConditionsStatus({ ...winCondtionsStatus, "middleRow": true });
                setWinConditionsClickedStatus(true);
            }}>
                Middle Row
            </Button>
            {(winConditionsAvailableStatus["middleRow"] === true) && winConditionsCheckLimitCount["middleRow"] !== 0 &&
                <Typography display="inline" className="text-danger">
                    <ClearIcon /> {winConditionsCheckLimitCount["middleRow"]}/{MAX_CHECK_LIMIT}
                </Typography>
            }
            {!(winConditionsAvailableStatus["middleRow"] === true) && <Typography display="inline" variant="body1" className="text-success">{winConditionsAvailableStatus["middleRow"]}</Typography>}
            <br />
            <br />
            <Button variant="contained" color="primary" disabled={winConditionsAvailableStatus["lastRow"] === true && winConditionsCheckLimitCount["lastRow"] < MAX_CHECK_LIMIT ? false : true} value="lastRow" onClick={() => {
                setWinConditionsStatus({ ...winCondtionsStatus, "lastRow": true });
                setWinConditionsClickedStatus(true);
            }}>
                Last Row
            </Button>
            {(winConditionsAvailableStatus["lastRow"] === true) && winConditionsCheckLimitCount["lastRow"] !== 0 &&
                <Typography display="inline" className="text-danger">
                    <ClearIcon /> {winConditionsCheckLimitCount["lastRow"]}/{MAX_CHECK_LIMIT}
                </Typography>
            }
            {!(winConditionsAvailableStatus["lastRow"] === true) && <Typography display="inline" variant="body1" className="text-success">{winConditionsAvailableStatus["lastRow"]}</Typography>}
            <br />
            <br />
            <Button variant="contained" color="primary" disabled={winConditionsAvailableStatus["fullHousie"] === true && winConditionsCheckLimitCount["fullHousie"] < MAX_CHECK_LIMIT ? false : true} value="fullHousie" onClick={() => {
                setWinConditionsStatus({ ...winCondtionsStatus, "fullHousie": true });
                setWinConditionsClickedStatus(true);
            }}>
                Full Housie
            </Button>
            {(winConditionsAvailableStatus["fullHousie"] === true) && winConditionsCheckLimitCount["fullHousie"] !== 0 &&
                <Typography display="inline" className="text-danger">
                    <ClearIcon /> {winConditionsCheckLimitCount["fullHousie"]}/{MAX_CHECK_LIMIT}
                </Typography>
            }
            {!(winConditionsAvailableStatus["fullHousie"] === true) && <Typography display="inline" variant="body1" className="text-success">{winConditionsAvailableStatus["fullHousie"]}</Typography>}
            <br />
            <br />

        </>);
}

export default WinCombo;