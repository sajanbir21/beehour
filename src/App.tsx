import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AmbientBg from './components/AmbientBg';
import Layout from './components/Layout';
import Home from './pages/Home';
import AiCuriosity from './pages/AiCuriosity';
import DailyPrompt from './pages/DailyPrompt';

export default function App() {
  return (
    <BrowserRouter>
      <AmbientBg />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-curiosity" element={<AiCuriosity />} />
          <Route path="/daily-prompt" element={<DailyPrompt />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
