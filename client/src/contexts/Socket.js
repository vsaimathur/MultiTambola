import React from "react";
import {io} from "socket.io-client";

//Socket Initialization (*** transports are very necessary, without that sockets are not working)
export const socket = io(process.env.SERVER_URL || "http://127.0.0.1:5000", {transports: ['websocket', 'polling', 'flashsocket']});
export const SocketContext = React.createContext();