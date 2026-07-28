import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ChroniclesPage from './pages/ChroniclesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import WinnersPage from './pages/WinnersPage';
import QuillCouncilPage from './pages/QuillCouncilPage';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-parchment dark:bg-ink text-stone-800 dark:text-parchment/90 bg-parchment-texture">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chronicles" element={<ChroniclesPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/winners" element={<WinnersPage />} />
              <Route path="/quill-council" element={<QuillCouncilPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;