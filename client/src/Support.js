import { Typography, TextField, Button, TextareaAutosize } from "@material-ui/core";
import { useEffect, useState} from "react";

const rootStyles = {
    minHeight: "100%",
    display: "grid",
    gridTemplateRows: "10% auto",
}

const supportFormStyle = {
    minHeight: "100%",
    display: "grid",
    gridTemplateRows: "repeat(4, '1fr')",
}

const errorMsgCSS = {
    padding: "0%",
    boxSizing: "inherit",
    margin: "0",
    fontSize: "0.75rem",
    marginTop: "3px",
    textAlign: "left",
    fontWeight: "400",
    lineHeight: "1.66",
    marginLeft: "14px",
    marginRight: "14px",
    color: "#f44336",
}
const Support = () => {

    const [supportClientName, setSupportClientName] = useState("");
    const [supportClientNameError, setSupportClientNameError] = useState(false);

    const [supportClientEmail, setSupportClientEmail] = useState("");
    const [supportClientEmailError, setSupportClientEmailError] = useState(false);

    const [supportClientMessage, setSupportClientMessage] = useState("");
    const [supportClientMessageError, setSupportClientMessageError] = useState(false);

    const [infoFilledStatus, setInfoFilledStatus] = useState(false);

    const validateEmail = (emailVal) => {
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(emailVal)
    }

    const handleSubmitSupportForm = () => {
        let tempErrorCheck = false;
        if (supportClientName === "") {
            setSupportClientNameError("Name cannot be blank");
            tempErrorCheck = true;
        }
        if (supportClientEmail === "") {
            setSupportClientEmailError("Email cannot be blank");
            tempErrorCheck = true;
        }
        if (!validateEmail(supportClientEmail)) {
            setSupportClientEmailError("Enter a valid email address");
            tempErrorCheck = true;
        }
        if (supportClientMessage === "") {
            setSupportClientMessageError("Message cannot be blank");
            tempErrorCheck = true;
        }
        if(tempErrorCheck) {
            return false
        }
        setSupportClientNameError(false);
        setSupportClientEmailError(false);
        setSupportClientMessageError(false);
        setInfoFilledStatus(true);
    }

    // const FormSubmitNAck = async () => {
    //     //some call to send form data to firebase DB.
    //     //implement later
    // }

    useEffect(() => {
        if (infoFilledStatus) {
            //call FormSubmitAck
        }
    }, [infoFilledStatus])

    return (
        <div style={rootStyles}>
            <Typography variant="h4" align="center" color="secondary" className="text-uppercase mt-auto">Support Form</Typography>
            <div style={supportFormStyle} className="d-flex flex-column align-items-center justify-content-center">
                <TextField required variant="outlined" label="Name" name="support-client-name" id="support-client-name" value={supportClientName} error={supportClientNameError !== false} helperText={supportClientNameError} onChange={(event) => setSupportClientName(event.target.value)} />
                <br />
                <br />
                <TextField required variant="outlined" label="Email" name="support-client-email" id="support-client-email" value={supportClientEmail} error={supportClientEmailError !== false} helperText={supportClientEmailError} onChange={(event) => setSupportClientEmail(event.target.value)} />
                <br />
                <br />
                <TextareaAutosize style = {{backgroundColor : "#03fc9d"}} rowsMin = {3} cols = {30} placeholder="Message*" name="support-client-message" id="support-client-message" value={supportClientMessage} onChange={(event) => setSupportClientMessage(event.target.value)} />
                { supportClientMessageError!==false && <div style = {errorMsgCSS}>{supportClientMessageError}</div> }
                <br />
                <br />
                <Button variant="contained" color="primary" onClick={handleSubmitSupportForm} >Submit</Button>
            </div>
        </div>
    );
}

export default Support;