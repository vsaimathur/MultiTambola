import { useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from '@material-ui/core/Button';

const Header = () => {
    const history = useHistory();
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            {/* <Navbar.Brand>React-Bootstrap</Navbar.Brand> */}
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <div className="mr-auto"><Button onClick = {() => history.push("/")}><Nav.Link>Home</Nav.Link></Button></div>
                    <div className="mr-auto"><Button onClick = {() => history.push("/rules")}><Nav.Link>Rules</Nav.Link></Button></div>
                    <div className="mr-auto"><Button onClick = {() => history.push("/play")}><Nav.Link>Play</Nav.Link></Button></div>
                    <div className="mr-auto"><Button onClick = {() => history.push("/support")}><Nav.Link>Support</Nav.Link></Button></div>
                </Nav>

                {/* Might use this lower Nav when implementing dark mode for this game! */}
                {/* <Nav>
                    <Nav.Link href="#deets">More deets</Nav.Link>
                    <Nav.Link eventKey={2} href="#memes">
                        Dank memes
                    </Nav.Link>
                </Nav> */}
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;