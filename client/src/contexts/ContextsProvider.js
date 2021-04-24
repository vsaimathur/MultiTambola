import usePlayerNames, { PlayerNamesContext } from './usePlayerNames';
import usePlayerCheck, { PlayerCheckContext } from './usePlayerCheck';
import useLiveNumGen, { LiveNumGenContext } from './useLiveNumGen';
import useTicketStatusLive, { TicketLiveStatusContext } from './useTicketStatusLive';
import useTicketsData, { TicketsDataContext } from './useTicketsData';
import useWinConditionsAvailable, { WinConditionsAvailableContext } from './useWinConditionsAvailable';
import { createMuiTheme, ThemeProvider, CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({
    typography: {
        fontFamily: "Comic Sans MS"
    }
})

const ContextsProvider = ({ children }) => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline>
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
                </CssBaseline>
            </ThemeProvider>
        </>)
}

export default ContextsProvider;