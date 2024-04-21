import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from '../src/pages/LoginRegister';
import Trip from '../src/pages/Trip'; // Import the Trip page

export default function PageRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Trip" element={<Trip />} />
      </Routes>
    </Router>
  );
}