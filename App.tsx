import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a113c] to-gray-900 text-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute>
                        <AdminPage />
                    </ProtectedRoute>
                } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
