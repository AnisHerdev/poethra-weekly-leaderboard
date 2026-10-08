import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const ChroniclesPage = lazy(() => import('./pages/ChroniclesPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const WinnersPage = lazy(() => import('./pages/WinnersPage'));
const QuillCouncilPage = lazy(() => import('./pages/QuillCouncilPage'));

const PageFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 py-16 text-oxblood dark:text-lamplight">
    <div className="w-8 h-8 rounded-full border-2 border-oxblood/20 dark:border-lamplight/30 border-t-oxblood dark:border-t-lamplight animate-spin" />
    <span className="font-display italic text-sm text-stone-600 dark:text-parchment/70 tracking-wide">
      Unrolling the manuscript...
    </span>
  </div>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-parchment dark:bg-ink text-stone-800 dark:text-parchment/90 bg-parchment-texture">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chronicles" element={<ChroniclesPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/winners" element={<WinnersPage />} />
                <Route path="/quill-council" element={<QuillCouncilPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;