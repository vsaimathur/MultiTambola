import React, {useState} from 'react';

export const TicketLiveStatusContext = React.createContext();
const useTicketStatusLive = () => {
    const [ticketStatusLive, setTicketStatusLive] = useState([]);

    return {ticketStatusLive, setTicketStatusLive};
}
 
export default useTicketStatusLive;