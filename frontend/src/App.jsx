import {UserContextProvider} from "./components/UserContext";
import Routes from "./routes";
import axios from "axios"

export default function App() {
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

