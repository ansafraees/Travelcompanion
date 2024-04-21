import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from '../src/pages/Home';
import Trip from '../src/pages/Trip';

export default function PageRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Trip" element={<Trip />} />
      </Routes>
    </Router>
  );
}