import { BrowserRouter, Routes, Route } from "react-router-dom";
import Catalogo from "./pages/Catalogo";
import Admin from "./pages/Admin";
import "./App.css";
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <BrowserRouter>
    <Analytics/>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;