import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import { TicketsDataContext } from "./contexts/useTicketsData";
import { TicketLiveStatusContext } from "./contexts/useTicketStatusLive";
import Ticket from './Ticket';

const Tickets = () => {

    const socket = useContext(SocketContext);
    const {tickets,setTickets} = useContext(TicketsDataContext);
    const {ticketStatusLive, setTicketStatusLive} = useContext(TicketLiveStatusContext);
    const handleGetTickets = (data) => {   

        //getting the data of tickets.
        setTickets(data.tickets);

        //initializing the ticket live status according to no. of tickets.
        if (data.tickets.length === 1) {
            setTicketStatusLive([
                [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]
            ]);
        }
        else {
            setTicketStatusLive([
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ], 
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        ])
        }
    }

    const handleTicketNumberClicked = (ticketIndex, row, col) => {
        console.log(ticketIndex, row, col);

        //changing the value by obtaining shallow copy at each stage and assigning new value and reiterating back and updating state.
        //can also do a deep copy instead here. But preferring shallow copy instead as to save loading of loadash or rdfc or writing necessary fucntion.
        let tempTicketStatusLive = [...ticketStatusLive];
        let tempTicketNoAffectedLive = [...tempTicketStatusLive[ticketIndex]];
        let tempTicketRowAffectedLive = [...tempTicketNoAffectedLive[row]];
        let tempTicketColAffectedLive = tempTicketRowAffectedLive[col];
        tempTicketColAffectedLive = !tempTicketColAffectedLive;
        tempTicketRowAffectedLive[col] = tempTicketColAffectedLive;
        tempTicketNoAffectedLive[row] = tempTicketRowAffectedLive;
        tempTicketStatusLive[ticketIndex] = tempTicketNoAffectedLive;
        setTicketStatusLive(tempTicketStatusLive);
    }
    useEffect(() => {
        socket.emit("GET_TICKETS_REQ");

        socket.on("GET_TICKETS_ACK", handleGetTickets);

        return () => socket.off("GET_TICKETS_ACK", handleGetTickets);
    }, [socket])
    
    useEffect(() => {
        console.log(ticketStatusLive);
    },[ticketStatusLive])
    
    return (
        <>
            {
                tickets && tickets.map((ticket, ticketIndex) => {
                    return <Ticket key={ticketIndex} data={ticket} handleTicketNumberClicked={(row, col) => handleTicketNumberClicked(ticketIndex, row, col)} />
                })
            }
        </>
    )
}

export default Tickets;