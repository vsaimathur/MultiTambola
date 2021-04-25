import { useContext } from 'react';
import Table from 'react-bootstrap/Table';
import { TicketLiveStatusContext } from './contexts/useTicketStatusLive';

const Ticket = ({ data, ticketIndex, handleTicketNumberClicked }) => {
    const { ticketStatusLive } = useContext(TicketLiveStatusContext);
    return (
        <>
            <Table variant="dark" bordered style={{ width: "40%" }}>
                <tbody>
                    {
                        data.map((row, index_r) => {
                            return (
                                <tr key={index_r}>
                                    {
                                        row.map((col, index_c) => {
                                            //if there is no number in cell i.e., 0 we'll not show it, also not write onClick for it
                                            //which avoids complications like getting 0 added into row list and checked at server side
                                            //when a win condition is clicked.
                                            if (col === 0) return <td key={index_c}></td>
                                            return <td key={index_c} className={`text-center ripple ${ticketStatusLive.length !== 0 && ticketStatusLive[ticketIndex][index_r][index_c] ? "bg-warning" : ""}`} style={{ cursor: "pointer" }} onClick={(event) => handleTicketNumberClicked(index_r, index_c)}>{col}</td>
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </>);
}

export default Ticket;