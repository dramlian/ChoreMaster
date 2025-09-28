import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChoreList from '../ChoreList/ChoreList.tsx';
import Header from '../Header/Header.tsx';
import { ApiProvider } from '../../contexts/ApiContext.tsx';
import { AuthProvider, useAuth } from '../../contexts/AuthContext.tsx';
import Footer from '../Footer/Footer.tsx';

const AppContent = () => {
  const { isAuthenticated, isTokenValid } = useAuth();
  
  const isLoggedIn = isAuthenticated && isTokenValid();

  return (
    <ApiProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            {isLoggedIn ? (
              <Routes>
                <Route path="*" element={<Navigate to="/chores" replace />} />
                <Route path="/chores" element={<ChoreList />} />
              </Routes>
            ) : (
              <div className="container mt-5 text-center">
                <h2>Please log in to access ChoreMaster</h2>
                <p>Use the Google login button in the header to get started.</p>
              </div>
            )}
          </main>
          <Footer />
        </div>
      </Router>
    </ApiProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;