import { Typography } from "@material-ui/core";
import FrontImg from "./images/tambola-title-img.jpg";

const rootStyles = {
    minHeight: "100%",
    display: "grid",
    gridTemplateRows: "10% auto",
}

const centerFirstPageStyle = {
    minHeight: "100%",
}

const Home = () => {
    return (
        <div style={rootStyles}>
            <Typography id="main-heading" align="center" className = "mt-auto">Multi Tambola</Typography>
            <div style={centerFirstPageStyle} className = "d-flex align-items-center justify-content-around">
                <img src={FrontImg} width = "600px" height = "300px" alt="Tambola Fun Img!" />
                <Typography variant = "h4" className = "w-25">Enjoying a party, let's make it more lively!</Typography>
            </div>
        </div>
    );
}

export default Home;