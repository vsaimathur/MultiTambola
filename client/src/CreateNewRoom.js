import { FormControl, FormControlLabel, FormLabel, RadioGroup, TextField, Radio, Button, Container, Typography } from "@material-ui/core";
import { useEffect, useState, useRef, useContext } from "react";
import { useHistory } from "react-router";
import { SocketContext } from "./contexts/Socket";
import { PlayerNamesContext } from "./contexts/usePlayerNames";
import FileCopyIcon from '@material-ui/icons/FileCopy';

const CreateNewRoom = () => {

    //useContext Var
    //Socket Instance
    const socket = useContext(SocketContext);

    const roomPlayerNames = useContext(PlayerNamesContext);


    const history = useHistory();

    //variables used
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [roomCreationStatus, setRoomCreationStatus] = useState(false);
    const [infoFilledStatus, setInfoFilledStatus] = useState(false);
    const [noTickets, setNoTickets] = useState("1");
    const [gameStarted, setGameStarted] = useState(false);
    const [roomIDGen, setRoomIDGen] = useState(null);



    //useRef variables

    //for accessing name & select option (noTickets) elements to disabled them after infoFilledStatus -> true
    let noTicketsRef = useRef();
    let nameRef = useRef();
    let copyRoomIDRef = useRef();

    //button / click handlers

    //on clicking generate roomID button it changes the state of infoFilledStatus to true if name is entered correctly.
    const handleGenerateRoomIDButton = () => {
        if (name === "") {
            setNameError("Name field cannot be blank");
            return false;
        }
        setNameError(false);
        setInfoFilledStatus(true);
        nameRef.current.disabled = true;
        noTicketsRef.current.disabled = true;
    }

    //This handles the start of game
    const handleGameStartButton = () => {
        console.log(roomCreationStatus, roomPlayerNames.length);
        if (!roomCreationStatus || roomPlayerNames.length < 2) {
            setGameStarted(false);
            return false;
        }
        console.log(11);
        setGameStarted(true);
    }

    const handleStartGameAck = () => {
        console.log(1111);
        history.push("/gameroom");
    }

    //listener handlers

    //set the roomID when a new ID is given to host 
    const handleRoomIDGenerated = (data) => {
        setRoomIDGen(data.roomID);
        setRoomCreationStatus(true);
    }

    const handleRoomIDCopyToClipBoard = (event) => {
        event.preventDefault();
        copyRoomIDRef.current.select();
        copyRoomIDRef.current.setSelectionRange(0, 99999); /*For mobile devices*/
        document.execCommand("copy");
    }

    //This useEffect listens to roomPlayerNames list updates (if a new player joins the room. handleJoinedAckPlayerRoomNames fires & it
    //updates our/ client copy of roomPlayerNames List  )

    //This useEffect also emits the details of host player if details are entered & gets the roomID generated from server by listening 
    //to ROOM_ID_GENERATED EVENT.

    useEffect(() => {



        if (infoFilledStatus) {
            socket.emit("CREATE_ROOM_ID", {
                hostName: name,
                noTickets
            })
        }

        socket.on("ROOM_ID_GENERATED", handleRoomIDGenerated);

        return () => socket.off("ROOM_ID_GENERATED", handleRoomIDGenerated);

    }, [socket, infoFilledStatus, noTickets])


    //gameStarted useEffect which emit's the startGame request from host player
    useEffect(() => {
        if (gameStarted) {
            console.log(111);
            socket.emit("GAME_START_REQ");
        }

        socket.on("GAME_START_ACK", handleStartGameAck);

        return () => socket.off("GAME_START_ACK", handleStartGameAck);
    }, [socket, gameStarted])

    return (
        <div className={`h-100 d-flex align-items-center`} >
            <Container disableGutters className={`d-flex justify-content-center`}>
                <div style={{ border: "2px solid blue", padding: '5vh' }}>
                    <Typography variant="h5" color="secondary">CREATE ROOM FORM</Typography>
                    <br />
                    <TextField required disabled={roomCreationStatus ? true : false} variant="outlined" label="Name" ref={nameRef} name="host-name" id="host-name" value={name} error={nameError !== false} helperText={nameError} onChange={(event) => setName(event.target.value)} />
                    <br />
                    <br />
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select No. of tickets : </FormLabel>
                        <RadioGroup required ref={noTicketsRef} name="no-tickets" id="no-tickets" value={noTickets} onChange={(event) => setNoTickets(event.target.value)}>
                            <FormControlLabel disabled={roomCreationStatus ? true : false} value="1" control={<Radio />} label="1" />
                            <FormControlLabel disabled={roomCreationStatus ? true : false} value="2" control={<Radio />} label="2" />
                            {/* <FormControlLabel value="3" control={<Radio />} label="3" /> */}
                        </RadioGroup>
                    </FormControl>
                    <br />
                    <br />
                    {!infoFilledStatus && <Button variant="contained" color="primary" onClick={handleGenerateRoomIDButton}>Generate RoomID</Button>}
                    {infoFilledStatus && !roomCreationStatus && <div>Creating Room ID</div>}
                    {roomCreationStatus &&
                        <div>
                            <span>  
                                <span>Room ID :</span>
                                <textarea rows = "1" cols = "10" ref={copyRoomIDRef} defaultValue = {roomIDGen} readOnly/>
                            </span>
                            <Button variant = "contained" color = "primary" onClick={handleRoomIDCopyToClipBoard}><FileCopyIcon /></Button>
                        </div>
                    }
                    <br />
                {roomCreationStatus && <p>Share this Room ID with participants & click on start to start the game!</p>}
                <br />
                {/* This displays 0 if no player joined the room & total players in room - 1 if any player joined */}
                {roomCreationStatus && <p>Player's Joined : {roomPlayerNames.length === 0 ? 1 : roomPlayerNames.length}</p>}

                {/* This button gets disabled as soon a new room is created by Server */}
                <Button variant="contained" color="primary" disabled={roomCreationStatus ? false : true} onClick={handleGameStartButton}>START</Button>
                </div>
            </Container>
        </div >
    );
}

export default CreateNewRoom;