
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
const Header = () => {
    return (     <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>ChoreMaster</Navbar.Brand>
           <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
        </Container>
      </Navbar>)
}

export default Header