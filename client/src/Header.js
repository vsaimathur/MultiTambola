import {Link} from 'react-router-dom';

const Header = () => {
    return (
        <div className="header">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="top-navbar">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <Link class="nav-link" to="/">Home <span class="sr-only">(current)</span></Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/rules">Rules</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/play">Play</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/support">Support</Link>
                        </li>
                    </ul>
                    {/* <div><button class="btn btn-light" id="toggle-theme-btn">Light</button></div> */}
                </div>
            </nav>
        </div>
    );
}

export default Header;