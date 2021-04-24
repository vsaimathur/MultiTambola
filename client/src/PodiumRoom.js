import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { useContext } from "react";
import { WinConditionsAvailableContext } from "./contexts/useWinConditionsAvailable";

const PodiumRoom = () => {
    const { winConditionsAvailableStatus } = useContext(WinConditionsAvailableContext);
    return (
        <>
            <Typography variant="h4" color="secondary">Winners</Typography>
            <List>
                {Object.keys(winConditionsAvailableStatus).map((key, index) => {
                    if(winConditionsAvailableStatus[key] === true) return false;
                    return <ListItem button key={index}> <ListItemText primary={`${key}    -    ${winConditionsAvailableStatus[key]}`}></ListItemText> </ListItem>
                })}
            </List>
        </>);
}

export default PodiumRoom;