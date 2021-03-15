import {Link} from 'react-router-dom';
const Play = () => {
    return (
        <>
            <div className="text-center text-danger">This is Game Maker Page!</div>
            <div className="center-content">
                <div className="game-maker-buttons">
                    <div className="text-center text-success">What to do ?</div>
                    <br/>
                    <Link className="btn btn-primary" id="create-room-button" to="/createnewroom">Create Room</Link>
                    <br />
                    <br />
                    <Link className="btn btn-primary" id="join-room-button" to="/joinroom">Join Room</Link>
                </div>
            </div>
        </>
    );
}

export default Play;