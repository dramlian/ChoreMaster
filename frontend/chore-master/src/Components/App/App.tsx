
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChoreList from '../ChoreList/ChoreList.tsx';
import Manage from '../Manage/Manage.tsx';
import Header from '../Header/Header.tsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="*" element={<Navigate to="/chores" replace />} />
        <Route path="/chores" element={<ChoreList />} />
        <Route path="/manage" element={<Manage />} />
      </Routes>
    </Router>
  );
}

export default App;
