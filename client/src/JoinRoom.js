import { useContext, useEffect, useRef, useState } from "react";
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
    const [infoFilledStatus, setInfoFilledStatus] = useState(false);
    const [roomPlayerNames, setRoomPlayerNames] = useState([]);
    const [liveRoomsAvailable, setLiveRoomsAvailable] = useState([]);
    const [roomAvailableStatus, setRoomAvailableStatus] = useState(null);

    //useRef Variables

    //for accessing name & select option (noTickets) elements to disabled them after infoFilledStatus -> true
    let playerNameRef = useRef();
    let noTicketsRef = useRef();
    let roomIDElementRef = useRef();

    //button/click handlers

    //on clicking join button it changes the state of infoFilledStatus to true if roomID is entered correctly & 
    //playerName also entered correctly.

    const getRoomAvailableStatus = (roomID) => {
        for(let i=0;i<liveRoomsAvailable.length;i++) {
            if(liveRoomsAvailable[i] === roomID.toString().trim()) return true;
        }
        return false;
    }

    const onFilledHandler = (event) => {
        event.preventDefault();
        console.log(liveRoomsAvailable);
        let roomAvailStatusCheck = getRoomAvailableStatus(roomID);
        console.log(roomAvailStatusCheck);
        setRoomAvailableStatus(roomAvailStatusCheck ? true : false);
        if (roomID < 100000 || roomID > 9999999 || !roomID || playerName.trim() === "" || !roomAvailStatusCheck) {
            setInfoFilledStatus(false);
            return false;
        }
        setInfoFilledStatus(true);
        playerNameRef.current.disabled = true;
        noTicketsRef.current.disabled = true;
        roomIDElementRef.current.disabled = true;
    }

    //listener handlers

    //redirects when join request is acknowledged by server
    const handleJoinAck = () => {
        history.push("/gameroom");
    }

    const handleLiveRoomsAvailable = (data) => {
        setLiveRoomsAvailable(data.liveRoomsAvailable);
    }

    //This useEffect emits the new player info. to server & waits for acknowledgement from the server
    useEffect(() => {
        socket.on("LIVE_ROOMS_AVAILABLE", handleLiveRoomsAvailable);

        if (infoFilledStatus) {
            socket.emit("JOIN_ROOM_REQ", {
                roomID,
                noTickets,
                playerName
            })
        }

        socket.on("JOIN_ROOM_ACK", handleJoinAck);

        return () => {
            socket.off("JOIN_ROOM_ACK", handleJoinAck);
            socket.off("LIVE_ROOMS_AVAILABLE", handleLiveRoomsAvailable);
        }

    }, [socket, noTickets, playerName, roomID, infoFilledStatus, history])

    return (
        <>
            <label htmlFor="room-id">Enter Room ID :</label>
            <br />
            <input ref={roomIDElementRef} type="number" name="room-id" id="room-id" required onChange={(event) => setRoomID(event.target.value)} />
            {roomAvailableStatus===false && <div className = "text-danger">Room is not available!</div>}  
            <br />
            <label htmlFor="player-name">Enter your name : </label>
            <br />
            <input ref={playerNameRef} type="text" name="player-name" id="player-name" value={playerName} required onChange={(event) => setPlayerName(event.target.value)} />
            <br />
            <label htmlFor="noTickets">Select Number of Tickets : </label>
            <br />
            <select ref={noTicketsRef} name="no-tickets" id="no-tickets" onChange={(event) => setNoTickets(event.target.value)} required >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            <br />
            <br />
            <button type="submit" className="btn btn-primary" name="join" id="join" onClick={onFilledHandler}>Join</button>
        </>);
}

export default JoinRoom;