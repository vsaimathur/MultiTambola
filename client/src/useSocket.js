import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
    const socketRef = useRef();
    const [testMsg, setTestMsg] = useState("");
    useEffect(() => {

        //listeners
        //***Here these options Transport is VIP , Socket does'nt get connected without it!.
        const socket = io("http://127.0.0.1:5000", {transports: ['websocket', 'polling', 'flashsocket']}); 
        socketRef.current = socket;

        socketRef.current.on("init-msg", (data) => {
            setTestMsg(data.msg);
        })

        return () => socketRef.current.disconnect();

    }, []);
    // emitters
    const sendMessage = () => {
        socketRef.current.emit("send-msg", {
            msg: "This is from send-msg event",
            sentSocketID: socketRef.current.id
        })
    }
    return { testMsg, sendMessage };
}

export default useSocket;