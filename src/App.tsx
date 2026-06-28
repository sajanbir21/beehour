import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AmbientBg from './components/AmbientBg';
import Layout from './components/Layout';
import Home from './pages/Home';
import AiCuriosity from './pages/AiCuriosity';
import DailyPrompt from './pages/DailyPrompt';
import Balance from './pages/Balance';
import Reset from './pages/Reset';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <AmbientBg />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-mirror" element={<AiCuriosity />} />
          <Route path="/your-question" element={<DailyPrompt />} />
          <Route path="/how-are-you" element={<Balance />} />
          <Route path="/quick-reset" element={<Reset />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
