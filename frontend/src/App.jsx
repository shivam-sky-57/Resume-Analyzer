import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import AnalysisResults from './pages/AnalysisResults';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<LoginPage />} /> {/* Handled within LoginPage in this version */}
        
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute><UploadPage /></ProtectedRoute>
        } />
        <Route path="/analysis/:id" element={
          <ProtectedRoute><AnalysisResults /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute><HistoryPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
