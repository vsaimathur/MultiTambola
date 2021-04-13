import usePlayerNames, { PlayerNamesContext } from './usePlayerNames';

const ContextsProvider = ({ children }) => {
    return (
        <>
            <PlayerNamesContext.Provider value={usePlayerNames()}>
                {children}
            </PlayerNamesContext.Provider>
        </>)
}

export default ContextsProvider;