import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import { TicketsDataContext } from "./contexts/useTicketsData";
import { TicketLiveStatusContext } from "./contexts/useTicketStatusLive";
import { WinConditionsAvailableContext } from "./contexts/useWinConditionsAvailable";
import { Button, Typography } from "@material-ui/core";

const WinCombo = () => {

    const socket = useContext(SocketContext);

    const { tickets } = useContext(TicketsDataContext);
    const { ticketStatusLive } = useContext(TicketLiveStatusContext);
    const { winConditionsAvailableStatus } = useContext(WinConditionsAvailableContext);

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
            <Button variant="contained" color="primary" disabled={winConditionsAvailableStatus["earlyFive"] === true && winConditionsCheckLimitCount["earlyFive"] <2 ? false : true} value="earlyFive" onClick={() => {
                setWinConditionsStatus({ ...winCondtionsStatus, "earlyFive": true });
                setWinConditionsClickedStatus(true);
            }}>
                Early Five
            </Button>
            {!(winConditionsAvailableStatus["earlyFive"] === true) && <Typography display = "inline" variant="body1" className="text-success">{winConditionsAvailableStatus["earlyFive"]}</Typography>}
            <br />
            <Button variant="contained" color="primary" disabled={winConditionsAvailableStatus["topRow"] === true  && winConditionsCheckLimitCount["topRow"] <2 ? false : true} value="topRow" onClick={() => {
                setWinConditionsStatus({ ...winCondtionsStatus, "topRow": true });
                setWinConditionsClickedStatus(true);
            }}>
                Top Row
            </Button>
            {!(winConditionsAvailableStatus["topRow"] === true) && <Typography display = "inline" variant="body1" className="text-success">{winConditionsAvailableStatus["topRow"]}</Typography>}
            <br />
            <Button variant="contained" color="primary" disabled={winConditionsAvailableStatus["middleRow"] === true && winConditionsCheckLimitCount["middleRow"] <2 ? false : true} value="middleRow" onClick={() => {
                setWinConditionsStatus({ ...winCondtionsStatus, "middleRow": true });
                setWinConditionsClickedStatus(true);
            }}>
                Middle Row
            </Button>
            {!(winConditionsAvailableStatus["middleRow"] === true) && <Typography display = "inline" variant="body1" className="text-success">{winConditionsAvailableStatus["middleRow"]}</Typography>}
            <br />
            <Button variant="contained" color="primary" disabled={winConditionsAvailableStatus["lastRow"] === true && winConditionsCheckLimitCount["lastRow"] <2 ? false : true} value="lastRow" onClick={() => {
                setWinConditionsStatus({ ...winCondtionsStatus, "lastRow": true });
                setWinConditionsClickedStatus(true);
            }}>
                Last Row
            </Button>
            {!(winConditionsAvailableStatus["lastRow"] === true) && <Typography display = "inline" variant="body1" className="text-success">{winConditionsAvailableStatus["lastRow"]}</Typography>}
            <br />         
            <Button variant="contained" color="primary" disabled={winConditionsAvailableStatus["fullHousie"] === true && winConditionsCheckLimitCount["fullHousie"] <2 ? false : true} value="fullHousie" onClick={() => {
                setWinConditionsStatus({ ...winCondtionsStatus, "fullHousie": true });
                setWinConditionsClickedStatus(true);
            }}>
                Full Housie
            </Button>
            {!(winConditionsAvailableStatus["fullHousie"] === true) && <Typography display = "inline" variant="body1" className="text-success">{winConditionsAvailableStatus["fullHousie"]}</Typography>}
            <br /> 

        </>);
}

export default WinCombo;