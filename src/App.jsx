import { BrowserRouter, Routes, Route } from "react-router-dom";
import Catalogo from "./pages/Catalogo";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;