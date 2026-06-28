import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AmbientBg from './components/AmbientBg';
import Layout from './components/Layout';
import Home from './pages/Home';
import Mind from './pages/Mind';
import Soul from './pages/Soul';

export default function App() {
  return (
    <BrowserRouter>
      <AmbientBg />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mind" element={<Mind />} />
          <Route path="/soul" element={<Soul />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
