import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
import ThankYouPage from './pages/ThankYouPage';
import AdminPage from './pages/AdminPage';
import './index.css';

// Protected route - only logged-in voters
const PrivateRoute = ({ children }) => {
  const { voter, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh' }}><div className="spinner" /></div>;
  return voter ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/vote" element={<PrivateRoute><VotingPage /></PrivateRoute>} />
          <Route path="/thankyou" element={<PrivateRoute><ThankYouPage /></PrivateRoute>} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
