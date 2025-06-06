import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login.tsx";
import Map from "./pages/map.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Router>
  );
}

export default App;
