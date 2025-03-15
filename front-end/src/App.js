import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import Men from "./pages/men"
import Women from "./pages/women"
import Fabrics from "./pages/fabrics"
import PageTemplate from './pages/pagetemplate';
import Preview from './pages/preview';
import Login from './pages/login';
import { AuthProvider } from './pages/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PageTemplate />}>
            <Route index element={<Home />} />
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path="/fabrics" element={<Fabrics />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="*" element={<NoPage />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
