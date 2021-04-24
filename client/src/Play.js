import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {useHistory} from 'react-router-dom';

const Play = () => {

    const history = useHistory();
    return (
        <>
            <Typography variant = "h4" color = "secondary" align = "center">This is Game Maker Page!</Typography>
            <div className="center-content">
                <div className="game-maker-buttons">
                    <div className="text-center text-success">What to do ?</div>
                    <br/>
                    <Button id="create-room-button" variant = "contained" color = "primary" onClick = {() => history.push("/createnewroom")}>Create Room</Button>
                    <br />
                    <br />
                    <Button id="join-room-button" variant = "contained" color = "primary" onClick = {() => history.push("/joinroom")}>Join Room</Button>
                </div>
            </div>
        </>
    );
}

export default Play;