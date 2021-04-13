import {useContext} from "react";
import { PlayerNamesContext } from './contexts/usePlayerNames';

const PlayersDisplayList = () => {

    const roomPlayerNames = useContext(PlayerNamesContext);
    return ( 
    <ul>

    {roomPlayerNames.map((name) => {
        return <li>{name}</li>
    })}

    </ul> );
}
 
export default PlayersDisplayList;