import { Typography } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import Table from "react-bootstrap/Table";

const PodiumRoom = () => {
    const socket = useContext(SocketContext);
    const [playersPoints, setPlayersPoints] = useState(null);
    const NO_PLAYERS_PODIUM = 8;

    const handleFinalPlayersPointsAck = (data) => {
        console.log(data.finalPlayersPoints);
        setPlayersPoints(data.finalPlayersPoints.sort((a, b) => a[1] > b[1]));
    }

    useEffect(() => {
        socket.emit("GET_FINAL_PLAYERS_POINTS_REQ");

        socket.on("GET_FINAL_PLAYERS_POINTS_ACK", handleFinalPlayersPointsAck);

        return () => socket.off("GET_FINAL_PLAYERS_POINTS_ACK");
    }, [socket])

    return (
        <>
            <Typography variant="h4" color="secondary" align = "center">Winners</Typography>
            <Table variant = "dark">
                <thead>
                    <tr>
                        <td className = "ripple">Rank</td>
                        <td className = "ripple">Name</td>
                        <td className = "ripple">Points</td>
                    </tr>
                </thead>
                <tbody>
                    {playersPoints &&
                        playersPoints.map((playerArr, index) => {
                            if (index < NO_PLAYERS_PODIUM) {
                                return (<>
                                    <tr>
                                        <td className = "ripple">{index + 1}</td>
                                        <td className = "ripple">{playerArr[0]}</td>
                                        <td className = "ripple">{playerArr[1]}</td>
                                    </tr>
                                </>)
                            }
                        })
                    }
                </tbody>
            </Table>
        </>);
}

export default PodiumRoom;