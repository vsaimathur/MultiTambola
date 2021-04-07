import { useEffect, useState, useRef, useContext} from "react";
import { SocketContext } from "./Socket";

const CreateNewRoom = () => {

    //Socket Instance
    const socket = useContext(SocketContext);

    //variables used
    const [name, setName] = useState("");
    const [roomCreationStatus, setRoomCreationStatus] = useState(false);
    const [infoFilledStatus, setInfoFilledStatus] = useState(false);
    const [noTickets, setNoTickets] = useState(1);
    const [currentlyJoinedRoomCount, setCurrentlyJoinedRoomCount] = useState(0);
    const [roomPlayerNames, setRoomPlayerNames] = useState([]);

    //mutable variable which updates itself with state. (not very clear) 
    let roomIDRef = useRef();

    //button / click handlers

    //on clicking generate roomID button it changes the state of infoFilledStatus to true if name is entered correctly.
    const handleGenerateRoomIDButton = () => {
        if (name === "") return false;
        setInfoFilledStatus(true);
    }

    //This handles the start of game
    const handleGameStartButton = () => {
        if (roomCreationStatus) return false;
        //*** TO WRITE LOGIC*/
    }

    //listener handlers

    //set the roomID when a new ID is given to host 
    const handleRoomIDGenerated = (data) => {
        roomIDRef.current = data.roomID;
        setRoomCreationStatus(true);
    }

    //updates roomPlayers list when new player joins the room
    const handleRoomPlayerNames = (data) => {
        setRoomPlayerNames(data.roomPlayerNames)
    }

    //This useEffect emits the details of host player if details are entered & gets the roomID generated from server by listening 
    //to ROOM_ID_GENERATED EVENT.
    useEffect(() => {
        if(infoFilledStatus) {
            socket.emit("CREATE_ROOM_ID", {
                hostName : name,
                noTickets
            })
        }
        socket.on("ROOM_ID_GENERATED", handleRoomIDGenerated);


        return () => socket.off("ROOM_ID_GENERATED", handleRoomIDGenerated);
    }, [socket, infoFilledStatus, noTickets])

    //This useEffect listens to roomPlayerNames list updates (if a new player joins the room. handleRoomPlayerNames fires & it
    //updates our/ client copy of roomPlayerNames List)
    useEffect(() => {

        socket.on("ROOM_PLAYER_NAMES", handleRoomPlayerNames);

        return () => socket.off("ROOM_PLAYER_NAMES", handleRoomPlayerNames);
    }, [socket])

    //This useEffect updates the currentlyJoinedRoomCount whenever roomPlayerNames list is updated. 
    useEffect(() => {
        console.log(roomPlayerNames)
        setCurrentlyJoinedRoomCount(roomPlayerNames.length)
    },[roomPlayerNames]);

    return (
        <>

            <label htmlFor="host-name">Enter your name : </label>
            <br />
            <input type="text" name="host-name" id="host-name" value={name} onChange={(event) => setName(event.target.value)} />
            <br />
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
            {!infoFilledStatus && <button className="btn btn-primary" onClick={handleGenerateRoomIDButton}>Generate RoomID</button>}
            {infoFilledStatus && !roomCreationStatus && <div>Creating Room ID</div>}
            {roomCreationStatus && <div>Room ID : {roomIDRef.current}</div>}
            <br />
            {roomCreationStatus && <p>Share this Room ID with participants & click on start to start the game!</p>}
            <br />
            {/* This displays 0 if no player joined the room & total players in room - 1 if any player joined */}
            {roomCreationStatus && <p>Player's Joined : {currentlyJoinedRoomCount-1 > 0 ? currentlyJoinedRoomCount-1 : 0}</p>}

            {/* This button gets disabled as soon a new room is created by Server */}
            <button className={`btn btn-primary + ${roomCreationStatus ? "" : "disabled"}`} onClick={handleGameStartButton}>START</button>
        </>
    );
}

export default CreateNewRoom;