import LiveNumDisplay from "./LiveNumDisplay";
import Tickets from "./Tickets";
import PlayersDisplayList from "./PlayersDisplayList";
import WinCombo from './WinCombo';

const GameRoom = () => {

    return (
        <>
            <LiveNumDisplay />
            <Tickets />
            <PlayersDisplayList />
            <WinCombo />
        </>
        );
}

export default GameRoom;