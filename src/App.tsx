import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppBar } from './components/AppBar';
import { Nav } from './components/Nav';
import { TopBar } from './components/TopBar';
import { CollapseProvider } from './lib/CollapseContext';
import { ProgressProvider } from './lib/ProgressContext';
import { ThemeProvider } from './lib/ThemeContext';
import { Certifications } from './pages/Certifications';
import { FastTrack } from './pages/FastTrack';
import { Overview } from './pages/Overview';
import { StudyPlan } from './pages/StudyPlan';

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <CollapseProvider>
          <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <TopBar />
            <div className="topstack">
              <AppBar />
              <Nav />
            </div>
            <div className="wrap">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/study-plan" element={<StudyPlan />} />
                <Route path="/fast-track" element={<FastTrack />} />
                <Route path="/certifications" element={<Certifications />} />
                {/* legacy redirects */}
                <Route path="/part-1" element={<Navigate to="/study-plan" replace />} />
                <Route path="/part-2" element={<Navigate to="/study-plan" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </HashRouter>
        </CollapseProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
}
