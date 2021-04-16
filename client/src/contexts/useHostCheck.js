import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "./Socket";

export const HostCheckContext = React.createContext()
const useHostCheck = () => {
    const [hostStatus, setHostStatus] = useState(null);
    const socket = useContext(SocketContext);

    const handleHostCheckAck = (data) => {
        setHostStatus(data.status);
    }
    useEffect(() => {
        socket.on("HOST_CHECK_ACK", handleHostCheckAck);

    },[socket])
    
    return hostStatus;
}
 
export default useHostCheck;