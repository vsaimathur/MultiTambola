import { useContext } from "react";
import { PointTrackerContext } from './contexts/usePointTracker';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'; //money coin symbol

const PointsDisplay = () => {
    const { pointsLive } = useContext(PointTrackerContext);
    return (
        <>
            <MonetizationOnIcon className={`${pointsLive === 0 ? "text-danger" : "text-warning"}`} />
            <span className={`${pointsLive === 0 ? "text-danger" : "text-warning"}`}>{pointsLive}</span>
        </>
    )
}

export default PointsDisplay;