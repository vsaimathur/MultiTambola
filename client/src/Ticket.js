const Ticket = ({ data }) => {
    return (
        <>
            <table className="table" border = "1px">
                <tbody>
                    {
                        data.map((row, index) => {
                            return (
                                <tr>
                                    {
                                        row.map((col) => {
                                            if(col === 0) return <td></td>
                                            return <td>{col}</td>
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