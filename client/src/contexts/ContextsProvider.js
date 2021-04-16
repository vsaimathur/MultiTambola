import usePlayerNames, { PlayerNamesContext } from './usePlayerNames';
import useHostCheck, { HostCheckContext } from './useHostCheck';
import useLiveNumGen, { LiveNumGenContext } from './useLiveNumGen';

const ContextsProvider = ({ children }) => {
    return (
        <>
            <PlayerNamesContext.Provider value={usePlayerNames()}>
                <HostCheckContext.Provider value={useHostCheck()}>
                    <LiveNumGenContext.Provider value={useLiveNumGen()}>
                        {children}
                    </LiveNumGenContext.Provider>
                </HostCheckContext.Provider>
            </PlayerNamesContext.Provider>
        </>)
}

export default ContextsProvider;