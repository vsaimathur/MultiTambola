import { useEffect, useState, useRef, useContext } from "react";
import { useHistory } from "react-router";
import { SocketContext } from "./contexts/Socket";
import { PlayerNamesContext } from "./contexts/usePlayerNames";

const CreateNewRoom = () => {

    //useContext Var
    //Socket Instance
    const socket = useContext(SocketContext);

    const roomPlayerNames = useContext(PlayerNamesContext);


    const history = useHistory();

    //variables used
    const [name, setName] = useState("");
    const [roomCreationStatus, setRoomCreationStatus] = useState(false);
    const [infoFilledStatus, setInfoFilledStatus] = useState(false);
    const [noTickets, setNoTickets] = useState(1);
    const [gameStarted, setGameStarted] = useState(false);
    const [roomIDGen, setRoomIDGen] = useState(null);



    //useRef variables

    //for accessing name & select option (noTickets) elements to disabled them after infoFilledStatus -> true
    let noTicketsRef = useRef();
    let nameRef = useRef();

    //button / click handlers

    //on clicking generate roomID button it changes the state of infoFilledStatus to true if name is entered correctly.
    const handleGenerateRoomIDButton = () => {
        if (name === "") return false;
        setInfoFilledStatus(true);
        nameRef.current.disabled = true;
        noTicketsRef.current.disabled = true;
    }

    //This handles the start of game
    const handleGameStartButton = () => {
        if (!roomCreationStatus || roomPlayerNames.length < 2) {
            setGameStarted(false);
            return false;
        }
        setGameStarted(true);
    }

    const handleStartGameAck = () => {
        history.push("/gameroom");
    }

    //listener handlers

    //set the roomID when a new ID is given to host 
    const handleRoomIDGenerated = (data) => {
        console.log(data.roomID);
        setRoomIDGen(data.roomID);
        setRoomCreationStatus(true);
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
            socket.emit("GAME_START_REQ");
        }

        socket.on("GAME_START_ACK", handleStartGameAck);

        return () => socket.off("GAME_START_ACK", handleStartGameAck);
    }, [socket, gameStarted])

    return (
        <>

            <label htmlFor="host-name">Enter your name : </label>
            <br />
            <input ref={nameRef} type="text" name="host-name" id="host-name" value={name} onChange={(event) => setName(event.target.value)} />
            <br />
            <br />
            <label htmlFor="noTickets">Select Number of Tickets : </label>
            <br />
            <select ref={noTicketsRef} name="noTickets" id="noTickets" onChange={(event) => setNoTickets(event.target.value)} required >
                <option value="1">1</option>
                <option value="2">2</option>
                {/* <option value="3">3</option> */}
            </select>
            <br />
            <br />
            {!infoFilledStatus && <button className="btn btn-primary" onClick={handleGenerateRoomIDButton}>Generate RoomID</button>}
            {infoFilledStatus && !roomCreationStatus && <div>Creating Room ID</div>}
            {roomCreationStatus && <div>Room ID : {roomIDGen}</div>}
            <br />
            {roomCreationStatus && <p>Share this Room ID with participants & click on start to start the game!</p>}
            <br />
            {/* This displays 0 if no player joined the room & total players in room - 1 if any player joined */}
            {roomCreationStatus && <p>Player's Joined : {roomPlayerNames.length===0 ? 1 : roomPlayerNames.length}</p>}

            {/* This button gets disabled as soon a new room is created by Server */}
            <button className={`btn btn-primary`} disabled={roomCreationStatus ? false : true} onClick={handleGameStartButton}>START</button>
        </>
    );
}

export default CreateNewRoom;