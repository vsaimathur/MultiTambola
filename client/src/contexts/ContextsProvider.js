import usePlayerNames, { PlayerNamesContext } from './usePlayerNames';
import usePlayerCheck, { PlayerCheckContext } from './usePlayerCheck';
import useLiveNumGen, { LiveNumGenContext } from './useLiveNumGen';
import useTicketStatusLive, { TicketLiveStatusContext } from './useTicketStatusLive';
import useTicketsData, { TicketsDataContext } from './useTicketsData';
import useWinConditionsAvailable, { WinConditionsAvailableContext } from './useWinConditionsAvailable';

const ContextsProvider = ({ children }) => {
    return (
        <>
            <PlayerNamesContext.Provider value={usePlayerNames()}>
                <PlayerCheckContext.Provider value={usePlayerCheck()}>
                    <LiveNumGenContext.Provider value={useLiveNumGen()}>
                        <TicketsDataContext.Provider value={useTicketsData()}>
                            <TicketLiveStatusContext.Provider value={useTicketStatusLive()}>
                                <WinConditionsAvailableContext.Provider value={useWinConditionsAvailable()}>
                                    {children}
                                </WinConditionsAvailableContext.Provider>
                            </TicketLiveStatusContext.Provider>
                        </TicketsDataContext.Provider>
                    </LiveNumGenContext.Provider>
                </PlayerCheckContext.Provider>
            </PlayerNamesContext.Provider>
        </>)
}

export default ContextsProvider;