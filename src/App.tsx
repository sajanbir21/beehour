import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Today from './pages/Today';
import Goals from './pages/Goals';
import Review from './pages/Review';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Nav />
        <main className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Navigate to="/today" replace />} />
              <Route path="/today" element={<Today />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/review" element={<Review />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
