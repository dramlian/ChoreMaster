
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

const Header = () => {
    return (     <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>ChoreMaster</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/chores">ChoreList</Nav.Link>
            <Nav.Link as={Link} to="/manage">Manage Chores</Nav.Link>
          </Nav>
           <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
        </Container>
      </Navbar>)
}

export default Header