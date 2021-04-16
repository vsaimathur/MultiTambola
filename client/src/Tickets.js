import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import Ticket from './Ticket';

const Tickets = () => {

    const socket = useContext(SocketContext);
    const [noTicketsArr, setNoTicketsArr] = useState([]);

    const handleGetNoTickets = (data) => {
        let tempArr = []
        for (let i = 0; i < 2; i++) {
            tempArr.push(1);
        }
        setNoTicketsArr(prevVal => [...tempArr]);
    }
    useEffect(() => {
        socket.emit("GET_NO_TICKETS_REQ");

        socket.on("GET_NO_TICKETS_ACK", handleGetNoTickets);

        return () => socket.off("GET_NO_TICKETS_ACK", handleGetNoTickets);
    }, [socket])

    return (
        <>
            {/* Some CSS Problem with border while applying Br here. */}
            <table className="table" border ="1px"> 
                <tbody>
                    {noTicketsArr.map((val, index) => {
                        return (
                            <>
                                <Ticket key={index} /> <br/><br/>
                            </>)
                    })}
                </tbody>
            </table>
        </>)
}

export default Tickets;