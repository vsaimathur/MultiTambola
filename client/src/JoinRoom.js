import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./Socket";
import { useHistory } from "react-router-dom";

const JoinRoom = () => {

    //Socket Instance
    const socket = useContext(SocketContext);

    //useHistory hook for redirection / navigation 
    const history = useHistory();

    //variables
    const [roomID, setRoomID] = useState(null);
    const [noTickets, setNoTickets] = useState(1);
    const [playerName, setPlayerName] = useState("");
    const [infoFilledStatus,setInfoFilledStatus] = useState(false);
    const [roomPlayerNames, setRoomPlayerNames] = useState([]);

    //button/click handlers

    //on clicking join button it changes the state of infoFilledStatus to true if roomID is entered correctly & 
    //playerName also entered correctly.
    const onFilledHandler = (event) => {
        event.preventDefault();
        if(roomID < 100000 || roomID > 9999999 || !roomID || playerName.trim() === "") {
            setInfoFilledStatus(false);
            return false;
        }
        setInfoFilledStatus(true);
    }

    //listener handlers

    //redirects when join request is acknowledged by server
    const handleJoinAck = () => {
        history.push("/gameroom");
    }

    //This useEffect emits the new player info. to server & waits for acknowledgement from the server
    useEffect(() => {
        if(infoFilledStatus) {
            socket.emit("JOIN_ROOM_REQ", {
                roomID,
                noTickets,
                playerName
            })
        }

        socket.on("JOIN_ROOM_ACK", handleJoinAck);

        return () => {socket.off("JOIN_ROOM_ACK",handleJoinAck)}

    }, [socket,noTickets,playerName,roomID,infoFilledStatus,history])

    
    return (
        <>
                <label htmlFor="roomID">Enter Room ID :</label>
                <br />
                <input type="number" name="room-id" id="room-id" required onChange={(event) => setRoomID(event.target.value)} />
                <br />
                <label htmlFor="">Enter your name : </label>
                <br />
                <input type="text" name="player-name" id="player-name" value={playerName} required onChange={(event) => setPlayerName(event.target.value)} />
                <br />
                <label htmlFor="noTickets">Select Number of Tickets : </label>
                <br />
                <select name="noTickets" id="noTickets" onChange={(event) => setNoTickets(event.target.value)} required >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <br />
                <br />
                <button type="submit" className="btn btn-primary" name="join" id="join" onClick = {onFilledHandler}>Join</button>
        </>);
}

export default JoinRoom;