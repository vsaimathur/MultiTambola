import React, {useState} from 'react';

export const TicketsDataContext = React.createContext();
const useTicketsData = () => {
    const [tickets, setTickets] = useState([]);
    return {tickets, setTickets};
}
 
export default useTicketsData;