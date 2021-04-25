import { useEffect, useRef } from "react";

const useTimeout = (callback, delay) => {
    const callbackSaved = useRef();

    useEffect(() => {
        callbackSaved.current = callback;
    },[callback])

    useEffect(() => {
        const liveTick = () => {
            callbackSaved.current();
        }

        if (delay !== null) {
            let ci = setTimeout(liveTick, delay);
            return () => clearTimeout(ci);
        }   
    }, [delay])
}

export default useTimeout;