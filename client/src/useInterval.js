import { useEffect, useRef } from "react";

const useInterval = (callback, delay) => {
    const callbackSaved = useRef();

    useEffect(() => {
        callbackSaved.current = callback;
    },[callback])

    useEffect(() => {
        const liveTick = () => {
            callbackSaved.current();
        }

        if (delay !== null) {
            let ci = setInterval(liveTick, delay);
            return () => clearInterval(ci);
        }   
    }, [delay])
}

export default useInterval;