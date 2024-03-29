import Header from './Header';
// import Footer from './Footer';
import Home from './Home';
import Rules from './Rules';
import Support from './Support';
import Play from './Play';
import CreateNewRoom from './CreateNewRoom';
import JoinRoom from './JoinRoom';
import GameRoom from './GameRoom';
import { SocketContext, socket } from './contexts/Socket';
import ContextsProvider from './contexts/ContextsProvider';
import PodiumRoom from './PodiumRoom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index.css';

const App = () => {
    return (
        <SocketContext.Provider value={socket}>
            <ContextsProvider>
                <Router>
                    <div className="total">
                        <Header />
                        <div className="main-content">
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/rules" component={Rules} />
                                <Route exact path="/support" component={Support} />
                                <Route exact path="/play" component={Play} />
                                <Route exact path="/createnewroom" component={CreateNewRoom} />
                                <Route exact path="/joinroom" component={JoinRoom} />
                                <Route exact path="/gameroom" component={GameRoom} />
                                <Route exact path="/podiumroom" component={PodiumRoom} />
                            </Switch>
                        </div>
                        {/* <Footer /> //some problem with it's position. (not getting stuck at bottom) */}
                    </div>
                </Router>
            </ContextsProvider>
        </SocketContext.Provider>
    );
}

export default App;
