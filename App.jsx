import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getToken } from './utils/auth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateCarPage from './pages/CreateCarPage';
import EditCarPage from './pages/EditCarPage';
import CarDetailsPage from './pages/CarDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  const token = getToken();

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/create" element={
          <ProtectedRoute>
            <CreateCarPage />
          </ProtectedRoute>
        } />
        
        <Route path="/car/:id" element={
          <ProtectedRoute>
            <CarDetailsPage />
          </ProtectedRoute>
        } />
      {/* Add Edit Route */}
      <Route path="/car/:id/edit" element={
          <ProtectedRoute>
            <EditCarPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
