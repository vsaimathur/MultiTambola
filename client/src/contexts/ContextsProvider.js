import usePlayerNames, { PlayerNamesContext } from './usePlayerNames';
import usePlayerCheck, {PlayerCheckContext} from './usePlayerCheck';
import useLiveNumGen, { LiveNumGenContext } from './useLiveNumGen';

const ContextsProvider = ({ children }) => {
    return (
        <>
            <PlayerNamesContext.Provider value={usePlayerNames()}>
                <PlayerCheckContext.Provider value={usePlayerCheck()}>
                    <LiveNumGenContext.Provider value={useLiveNumGen()}>
                        {children}
                    </LiveNumGenContext.Provider>
                </PlayerCheckContext.Provider>
            </PlayerNamesContext.Provider>
        </>)
}

export default ContextsProvider;