import { useState } from "react";
import {Link} from 'react-router-dom';

const CreateNewRoom = () => {
    const [name,setName] = useState("");
    const RoomID = 0;
    return ( 
    <>
        <div>Room ID : {RoomID}</div>
        <label htmlFor="host-name">Enter your name : </label>
        <input type="text" name="host-name" id="host-name" value = {name} onChange = {(event) => setName(event.target.value)} />
        <p>Share this with participants & click on start to start the game!</p>
        <Link to = "/gameroom" className="btn btn-primary">START</Link>
    </> 
    );
}
 
export default CreateNewRoom;