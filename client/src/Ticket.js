const Ticket = ({ data, handleTicketNumberClicked }) => {
    return (
        <>
            <table className="table" border = "1px">
                <tbody>
                    {
                        data.map((row, index_r) => {
                            return (
                                <tr>
                                    {
                                        row.map((col,index_c) => {
                                            //if there is no number in cell i.e., 0 we'll not show it, also not write onClick for it
                                            //which avoids complications like getting 0 added into row list and checked at server side
                                            //when a win condition is clicked.
                                            if(col === 0) return <td></td>
                                            return <td onClick = {(event) => handleTicketNumberClicked(index_r,index_c)}>{col}</td>
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>);
}

export default Ticket;