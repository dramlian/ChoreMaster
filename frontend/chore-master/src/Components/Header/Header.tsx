import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const { isAuthenticated, user, login, logout, isTokenValid, loginError } = useAuth();

    const shouldShowLogin = !isAuthenticated || !isTokenValid();

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand>ChoreMaster</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        {shouldShowLogin ? (
                          <div style={{ colorScheme: "light" }}>
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    console.log(credentialResponse);
                                    if (credentialResponse.credential) {
                                        login(credentialResponse.credential);
                                    }
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                theme="filled_black"
                                type="icon"
                            />
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-3">
                                <span className="text-light">Welcome, {user?.given_name}</span>
                                <Button variant="outline-light" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {loginError && (
                <Alert variant="danger" className="mb-0 text-center">
                    {loginError}
                </Alert>
            )}
        </>
    );
};

export default Header;