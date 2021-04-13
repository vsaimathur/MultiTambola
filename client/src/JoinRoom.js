import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import { useHistory } from "react-router-dom";
import { PlayerNamesContext } from "./contexts/usePlayerNames";

const JoinRoom = () => {

    //useContext variables
    //Socket Instance
    const socket = useContext(SocketContext);

    const roomPlayerNames = useContext(PlayerNamesContext);

    //useHistory hook for redirection / navigation 
    const history = useHistory();

    //state variables
    const [roomID, setRoomID] = useState(null);
    const [noTickets, setNoTickets] = useState(1);
    const [playerName, setPlayerName] = useState("");
    const [infoFilledStatus, setInfoFilledStatus] = useState(false);
    const [roomJoinedStatus, setRoomJoinedStatus] = useState(null);


    //useRef Variables

    //for accessing name & select option (noTickets) elements to disabled them after infoFilledStatus -> true
    let playerNameRef = useRef();
    let noTicketsRef = useRef();
    let roomIDElementRef = useRef();

    //button/click handlers

    //on clicking join button it changes the state of infoFilledStatus to true
    const onFilledHandler = (event) => {
        event.preventDefault();
        setInfoFilledStatus(true);
    }

    //listener handlers

    const handleJoinRoomFailed = () => {
        setRoomJoinedStatus(false);

        // for useEffect Hook to emit JOIN_REQ event again
        setInfoFilledStatus(false);
    }

    const handleJoinRoomAck = () => {
        setRoomJoinedStatus(true);

        //Disabling the inputs in the client window so that he would'nt change the info. again.
        playerNameRef.current.disabled = true;
        noTicketsRef.current.disabled = true;
        roomIDElementRef.current.disabled = true;
    }

    //redirects when game is started by host.
    const handleStartGameAck = () => {
        history.push("/gameroom");
    }


    //This useEffect emits the new player info. to server & waits for acknowledgement, player names in room, & game start signal 
    //from the server
    useEffect(() => {

        if (infoFilledStatus) {
            socket.emit("JOIN_ROOM_REQ", {
                roomID,
                noTickets,
                playerName
            })
        }

        socket.on("JOIN_ROOM_FAILED", handleJoinRoomFailed);
        // socket.on("JOIN_ACK_ROOM_PLAYER_NAMES", handleJoinedAckPlayerRoomNames);
        socket.on("JOIN_ROOM_ACK", handleJoinRoomAck);

        socket.on("GAME_START_ACK", handleStartGameAck);

        return () => {
            // socket.off("JOIN_ACK_ROOM_PLAYER_NAMES", handleJoinedAckPlayerRoomNames);
            socket.off("JOIN_ROOM_FAILED", handleJoinRoomFailed);
            socket.off("JOIN_ROOM_ACK", handleJoinRoomAck);
            socket.off("GAME_START_ACK", handleStartGameAck);
        }

    }, [socket, noTickets, playerName, roomID, infoFilledStatus])


    return (
        <>
            <label htmlFor="room-id">Enter Room ID :</label>
            <br />
            <input ref={roomIDElementRef} type="number" name="room-id" id="room-id" required onChange={(event) => setRoomID(event.target.value)} />
            {roomJoinedStatus === false && <div className="text-danger">Room does'nt exist!</div>}
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
                {/* <option value="3">3</option> */}
            </select>
            <br />
            <br />
            <button type="submit" className="btn btn-primary" disabled = {roomJoinedStatus ? true : false} name="join" id="join" onClick={onFilledHandler}>Join</button>

            {roomJoinedStatus === true && <div className="text-success">Successfully Joined the room! & Waiting for Game To Start!<br /></div>}
            {roomJoinedStatus === true && <p>Player's Joined : {roomPlayerNames.length}</p>}
        </>);
}

export default JoinRoom;