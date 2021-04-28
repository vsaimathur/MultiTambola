import { useContext, useEffect, useState } from "react";
import { PointTrackerContext } from "./contexts/usePointTracker";
import { SocketContext } from "./contexts/Socket";
import Table from 'react-bootstrap/Table';
import { Button, Typography } from "@material-ui/core";
import { RoomBoardDataLiveContext } from "./contexts/useRoomBoardDataLive";
import useTimeout from './useTimeout';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'; //money coin symbol

const ShowBoard = () => {

    const socket = useContext(SocketContext);
    const { pointsLive } = useContext(PointTrackerContext);
    const { roomBoardDataLive } = useContext(RoomBoardDataLiveContext);
    const [openBoard, setOpenBoard] = useState(false);
    const roomBoard = [[1, 2, 3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
    [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
    [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
    [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
    [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]];

    const BOARD_DISAPPEAR_TIMEOUT = 30000; //30sec

    const handleShowBoardClicked = () => {
        //condition check for not emitting for points less than 5. If necessary will also write a error state for this.
        if (pointsLive < 5) return false;
        setOpenBoard(true);
    }

    const handleBoardClose = () => setOpenBoard(false);

    useTimeout(handleBoardClose, openBoard ? BOARD_DISAPPEAR_TIMEOUT : null);

    useEffect(() => {
        if (openBoard) {
            socket.emit("BOARD_DATA_REQ");
        }
    }, [socket, openBoard])

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleShowBoardClicked}>
                Show Board
                <Typography className={`${pointsLive === 0 ? "text-danger" : "text-warning"}`}>
                    <MonetizationOnIcon /> {5}
                </Typography>
            </Button>
            {openBoard && <Table id="modal-descp" variant="dark" bordered style={{ width: "40%" }}>
                <tbody>
                    {
                        roomBoard.map((row, index_r) => {
                            return (
                                <tr key={index_r}>
                                    {
                                        row.map((col, index_c) => {
                                            //if there is no number in cell i.e., 0 we'll not show it, also not write onClick for it
                                            //which avoids complications like getting 0 added into row list and checked at server side
                                            //when a win condition is clicked.
                                            return (<td key={index_c} className={`p-1 text-center ripple ${roomBoardDataLive.length !== 0 && roomBoardDataLive[index_r * 10 + index_c] ? "bg-success" : ""}`} style={{ cursor: "pointer" }}>{col}</td>)
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>}
        </div>
    );
}

export default ShowBoard;