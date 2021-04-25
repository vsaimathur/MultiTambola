import { useContext } from "react";
import { PointTrackerContext } from './contexts/usePointTracker';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'; //money coin symbol
import { Typography } from "@material-ui/core";

const PointsDisplay = () => {
    const { pointsLive } = useContext(PointTrackerContext);
    return (
        <Typography className={`${pointsLive === 0 ? "text-danger" : "text-warning"}`}>
            <MonetizationOnIcon  /> {pointsLive}
        </Typography>
    )
}

export default PointsDisplay;