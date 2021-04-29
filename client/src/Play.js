import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {useHistory} from 'react-router-dom';

const rootStyles = {
    minHeight : "100%",
    display : "grid",
    gridTemplateRows : "10% auto"

}

const centerContentStyles = {
    height : "100%"
}

const Play = () => {

    const history = useHistory();
    return (
        <div style = {rootStyles}>
            <Typography variant = "h4" color = "secondary" align = "center">This is Game Maker Page!</Typography>
            <div className="center-content d-flex justify-content-center align-items-center" style = {centerContentStyles}>
                <div style = {{border : "2px solid red"}} className="game-maker-buttons d-flex flex-column justify-content-center align-items-center p-5">
                    <div className="text-center text-success">What to do ?</div>
                    <br/>
                    <Button id="create-room-button" variant = "contained" color = "primary" onClick = {() => history.push("/createnewroom")}>Create Room</Button>
                    <br />  
                    <br />
                    <Button id="join-room-button" variant = "contained" color = "primary" onClick = {() => history.push("/joinroom")}>Join Room</Button>
                </div>
            </div>
        </div>
    );
}

export default Play;