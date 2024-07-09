import { QueryClient, QueryClientProvider} from "react-query";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from '../src/pages/Home';
import Trip from '../src/pages/Trip';
import WeekTrip from '../src/pages/Week';
import Chat from "../src/pages/chat";
import LoginRegister from "../src/pages/LoginRegister"

export default function PageRoutes() {
  const queryClient = new QueryClient()
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
      <Routes>
      
        <Route path="/" element={<LoginRegister />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Trip" element={<Trip />} />
        <Route path ="/chat" element={<Chat />}/>
        <Route path="/Trip/:lat/:lng/:type" element={<WeekTrip />} />
        
      </Routes>
      </QueryClientProvider>
    </Router>
  );
}