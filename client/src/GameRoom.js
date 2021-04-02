import useSocket from "./useSocket";

const GameRoom = () => {
    const {testMsg,sendMessage} = useSocket();

    return (
        <>
            <p>This is the msg by server : </p>
        </>);
    }

export default GameRoom;