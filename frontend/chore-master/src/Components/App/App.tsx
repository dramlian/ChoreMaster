
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChoreList from '../ChoreList/ChoreList.tsx';
import Header from '../Header/Header.tsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="*" element={<Navigate to="/chores" replace />} />
        <Route path="/chores" element={<ChoreList />} />
      </Routes>
    </Router>
  );
}

export default App;
