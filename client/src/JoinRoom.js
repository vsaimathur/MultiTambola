import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import { useHistory } from "react-router-dom";
import { PlayerNamesContext } from "./contexts/usePlayerNames";
import { Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from "@material-ui/core";

const JoinRoom = () => {

    //useContext variables
    //Socket Instance
    const socket = useContext(SocketContext);

    const roomPlayerNames = useContext(PlayerNamesContext);

    //useHistory hook for redirection / navigation 
    const history = useHistory();

    //state variables
    const [roomID, setRoomID] = useState("");
    const [roomIDError, setRoomIDError] = useState(null);
    const [noTickets, setNoTickets] = useState("1");
    const [playerName, setPlayerName] = useState("");
    const [playerNameError, setPlayerNameError] = useState(false);
    const [infoFilledStatus, setInfoFilledStatus] = useState(false);


    //useRef Variables

    //for accessing name & select option (noTickets) elements to disabled them after infoFilledStatus -> true
    let playerNameRef = useRef();
    let noTicketsRef = useRef();
    let roomIDElementRef = useRef();

    //button/click handlers

    const handleRoomIDEntered = (event) => {
        let tempVerificationRoomID = event.target.value;
        if(tempVerificationRoomID.trim() === "") {
            setRoomIDError("RoomID cannot be blank");
            return false;
        } 
        if(isNaN(parseInt(tempVerificationRoomID))) {
            setRoomIDError("RoomID should only be digits");
            return false;
        }
        setRoomID(tempVerificationRoomID);
    }
    //on clicking join button it changes the state of infoFilledStatus to true
    const onFilledHandler = (event) => {
        event.preventDefault();

        let errorFlagTemp = false;
        if (playerName.trim() === "") {
            setPlayerNameError("Name field cannot be blank");
            errorFlagTemp = true;
        }
        console.log(roomID);
        if (isNaN(roomID)) {
            
            errorFlagTemp = true;
        }
        if (errorFlagTemp) return false;
        setPlayerNameError(false);
        setRoomIDError(false);
        setInfoFilledStatus(true);
    }

    //listener handlers

    const handleJoinRoomFailed = () => {
        setRoomIDError("Room does'nt exist!");
        // for useEffect Hook to emit JOIN_REQ event again
        setInfoFilledStatus(false);
    }

    const handleJoinRoomAck = () => {
        setRoomIDError(false);

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
        <div className={`h-100 d-flex align-items-center`} >
            <Container disableGutters className={`d-flex justify-content-center`}>
                <div style={{ border: "2px solid blue", padding: '5vh' }}>
                    <Typography variant="h5" color="secondary">JOIN ROOM FORM</Typography>
                    <br />
                    <TextField disabled = {roomIDError === false ? true : false} variant="outlined" label={"Room ID"} ref={roomIDElementRef} error={roomIDError ? true : false} helperText={roomIDError} name="room-id" id="room-id" required onChange={handleRoomIDEntered} />
                    <br />
                    <br />
                    <TextField disabled = {roomIDError === false ? true : false} required variant="outlined" label="Name" ref={playerNameRef} name="player-name" id="player-name" value={playerName} error={playerNameError !== false} helperText={playerNameError} onChange={(event) => setPlayerName(event.target.value)} />
                    <br />
                    <br />
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select No. of tickets : </FormLabel>
                        <RadioGroup required ref={noTicketsRef} name="no-tickets" id="no-tickets" value={noTickets} onChange={(event) => setNoTickets(event.target.value)}>
                            <FormControlLabel disabled = {roomIDError === false ? true : false} value="1" control={<Radio />} label="1" />
                            <FormControlLabel disabled = {roomIDError === false ? true : false} value="2" control={<Radio />} label="2" />
                            {/* <FormControlLabel value="3" control={<Radio />} label="3" /> */}
                        </RadioGroup>
                    </FormControl>
                    <br />
                    <br />
                    <Button variant="contained" color="primary" disabled={roomIDError === false ? true : false} name="join" id="join" onClick={onFilledHandler}>Join</Button>
                    {roomIDError === false && <Typography className="text-success">Successfully Joined the room! & Waiting for Game To Start!<br /></Typography>}
                    {roomIDError === false && <Typography>Player's Joined : {roomPlayerNames.length}</Typography>}
                </div>
            </Container>
        </div>
    );
}

export default JoinRoom;