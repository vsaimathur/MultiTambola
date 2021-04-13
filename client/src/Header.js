import {Link} from 'react-router-dom';

const Header = () => {
    return (
        <div className="header">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id="top-navbar">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/rules">Rules</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/play">Play</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/support">Support</Link>
                        </li>
                    </ul>
                    {/* <div><button class="btn btn-light" id="toggle-theme-btn">Light</button></div> */}
                </div>
            </nav>
        </div>
    );
}

export default Header;