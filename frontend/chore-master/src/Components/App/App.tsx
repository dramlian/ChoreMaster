
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChoreList from '../ChoreList/ChoreList.tsx';
import Header from '../Header/Header.tsx';
import { ApiProvider } from '../../contexts/ApiContext.tsx';

function App() {
  return (
    <ApiProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="*" element={<Navigate to="/chores" replace />} />
          <Route path="/chores" element={<ChoreList />} />
        </Routes>
      </Router>
    </ApiProvider>
  );
}

export default App;
