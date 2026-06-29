import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Today from './pages/Today';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Progress from './pages/Progress';
import Review from './pages/Review';
import Onboarding from './pages/Onboarding';
import { isOnboarded } from './utils/storage';

export default function App() {
  const [onboarded, setOnboarded] = useState(isOnboarded());

  useEffect(() => { setOnboarded(isOnboarded()); }, []);

  if (!onboarded) {
    return <Onboarding onDone={() => setOnboarded(true)} />;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Nav />
        <main className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Navigate to="/today" replace />} />
              <Route path="/today"    element={<Today />} />
              <Route path="/goals"    element={<Goals />} />
              <Route path="/habits"   element={<Habits />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/review"   element={<Review />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
