import React from "react";
import {io} from "socket.io-client";

//Socket Initialization (*** transports are very necessary, without that sockets are not working)
export const socket = io("https://multi-tambola.herokuapp.com", {secure : true, transports: ['websocket', 'polling', 'flashsocket']});
export const SocketContext = React.createContext();