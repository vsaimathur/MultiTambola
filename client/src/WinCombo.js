import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import { TicketsDataContext } from "./contexts/useTicketsData";
import { TicketLiveStatusContext } from "./contexts/useTicketStatusLive";
import { WinConditionsAvailableContext } from "./contexts/useWinConditionsAvailable";

const WinCombo = () => {

    const socket = useContext(SocketContext);

    const { tickets } = useContext(TicketsDataContext);
    const { ticketStatusLive } = useContext(TicketLiveStatusContext);
    const { winConditionsAvailableStatus } = useContext(WinConditionsAvailableContext);

    const [winConditionsClickedStatus, setWinConditionsClickedStatus] = useState(false);
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

    const handleWinConditionsButtonClicked = (event) => {
        setWinConditionsStatus({ ...winCondtionsStatus, [event.target.value]: true });
        setWinConditionsClickedStatus(true);
    }

    const handleWinConditionsCheckAck = (data) => {
        setWinConditionsStatus(data.winConditionsAck);
        setWinConditionsClickedStatus(false);
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
            <button className="btn btn-primary" disabled={winConditionsAvailableStatus["earlyFive"] ? false : true} value={"earlyFive"} onClick={handleWinConditionsButtonClicked}>Early Five</button>
            <button className="btn btn-primary" disabled={winConditionsAvailableStatus["topRow"] ? false : true} value={"topRow"} onClick={handleWinConditionsButtonClicked}>Top Row</button>
            <button className="btn btn-primary" disabled={winConditionsAvailableStatus["middleRow"] ? false : true} value={"middleRow"} onClick={handleWinConditionsButtonClicked}>Middle Row</button>
            <button className="btn btn-primary" disabled={winConditionsAvailableStatus["lastRow"] ? false : true} value={"lastRow"} onClick={handleWinConditionsButtonClicked}>Last Row</button>
            <button className="btn btn-primary" disabled={winConditionsAvailableStatus["fullHousie"] ? false : true} value={"fullHousie"} onClick={handleWinConditionsButtonClicked}>Full Housie!</button>
        </>);
}

export default WinCombo;