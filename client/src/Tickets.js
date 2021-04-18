import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import Ticket from './Ticket';

const Tickets = () => {

    const socket = useContext(SocketContext);
    const [tickets, setTickets] = useState([]);
    const handleGetTickets = (data) => {
        setTickets(data.tickets);
    }
    useEffect(() => {
        socket.emit("GET_TICKETS_REQ");

        socket.on("GET_TICKETS_ACK", handleGetTickets);

        return () => socket.off("GET_TICKETS_ACK", handleGetTickets);
    }, [socket])

    return (
        <>
            {
                tickets && tickets.map((ticket, index) => {
                    return <Ticket key={index} data={ticket} />
                })
            }
        </>)
}

export default Tickets;