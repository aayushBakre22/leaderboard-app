import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./pages/Navbar";
import Users from "./pages/Users";
import Leaderboard from "./pages/Leaderboard";
import Claims from "./pages/Claims";

function App() {
  return (
    <>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route index element={<Leaderboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/claims" element={<Claims />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
