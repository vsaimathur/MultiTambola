import { Button, List, ListItem, ListItemText, makeStyles, Modal, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import { PlayerNamesContext } from './contexts/usePlayerNames';

const PlayersDisplayList = () => {

    const roomPlayerNames = useContext(PlayerNamesContext);
    const [openModal, setOpenModal] = useState(false);

    const handleCloseModal = () => setOpenModal(false);

    //styling for modal dialog box (participants list).
    const useStyles = makeStyles((theme) => ({
        //This overflow css property adds a scroll bar to list in modal when necessary if content is too big.
        list : {
            overflow : "auto",
            maxHeight: 400,
            maxWidth: 360,

        },
        paper: {
          position: 'absolute',
          width: 350,
          backgroundColor: theme.palette.background.paper,
          border: '2px solid #000',
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
          right : "15vw",
          top : "10vh"
        },
      }));

      const classes = useStyles();

    return (
        <div>
            <Button variant = "contained" color = "primary" onClick = {() => setOpenModal(true)}>Participants ({roomPlayerNames.length})</Button>
            <Modal open = {openModal} onClose = {handleCloseModal} aria-labelledby = "modal-title" aria-describedby = "modal-descp">
                <div className = {classes.paper}>
                <Typography id = "modal-title" variant = "h4" color = "secondary">Participants ({roomPlayerNames.length})</Typography>
                <List id = "modal-descp" className = {classes.list}>
                    {roomPlayerNames.map((name, index) =>   {
                        return <ListItem button key={index}> <ListItemText primary={name}></ListItemText> </ListItem>
                    })}

                </List>
                </div>
            </Modal>
        </div>
    );
}

export default PlayersDisplayList;