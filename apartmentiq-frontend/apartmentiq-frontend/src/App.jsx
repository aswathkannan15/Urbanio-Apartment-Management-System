import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider }  from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; 
import Navbar from './components/Navbar';

// Components
import ProtectedRoute    from './components/ProtectedRoute';

// Pages
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import FacilitiesPage    from './pages/resident/FacilitiesPage';
import FacilityDetailPage from './pages/resident/FacilityDetailPage';
import ResidentDashboard from './pages/resident/ResidentDashboard';
import BookingPage       from './pages/resident/BookingPage';
import MyBookingsPage    from './pages/resident/MyBookingsPage';
import EventsPage        from './pages/resident/EventsPage';
import MaintenancePage   from './pages/resident/MaintenancePage';
import CommunityBoard    from './pages/resident/CommunityBoard';
import PreApproveGuest   from './pages/resident/PreApproveGuest';
import NotificationsPage from './pages/resident/NotificationsPage';
import GatePortal        from './pages/security/GatePortal';
import AdminDashboard    from './pages/admin/AdminDashboard';

// Placeholder dashboards
const Unauthorized = () => <h1 style={{color:'#ff5f7e',padding:'40px'}}>403 — Unauthorized</h1>;

// 1. Create a Layout Component for Resident Pages
// This wraps the Navbar and uses <Outlet /> to render the specific page below it
const ResidentLayout = () => {
  return (
    <div className="page-layout">
      <Navbar />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default function App() {
  return (
    // 2. Wrap the ENTIRE application in your ThemeProvider and AuthProvider
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          
          <Routes>
            {/* --- Public Routes (No Navbar) --- */}
            <Route path="/"        element={<Navigate to="/login" />} />
            <Route path="/login"   element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* --- Admin & Security Routes (No Resident Navbar) --- */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/gate" element={
              <ProtectedRoute allowedRoles={['SECURITY']}>
                <GatePortal />
              </ProtectedRoute>
            } />

            {/* --- Resident Routes (WITH Navbar) --- */}
            {/* Wrap all resident routes in the ResidentLayout */}
            <Route element={<ResidentLayout />}>
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['RESIDENT']}>
                  <ResidentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/facilities" element={
                <ProtectedRoute allowedRoles={['RESIDENT']}>
                  <FacilitiesPage />
                </ProtectedRoute>
              } />
              <Route path="/facilities/:id" element={
                <ProtectedRoute allowedRoles={['RESIDENT']}>
                  <FacilityDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/book" element={
                <ProtectedRoute allowedRoles={['RESIDENT']}>
                  <BookingPage />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute allowedRoles={['RESIDENT']}>
                  <MyBookingsPage />
                </ProtectedRoute>
              } />
              <Route path="/maintenance" element={
                <ProtectedRoute allowedRoles={['RESIDENT']}>
                  <MaintenancePage />
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute allowedRoles={['RESIDENT']}>
                  <CommunityBoard />
                </ProtectedRoute>
              } />
              <Route path="/pre-approve" element={
                <ProtectedRoute allowedRoles={['RESIDENT']}>
                  <PreApproveGuest />
                </ProtectedRoute>
              } />
              <Route path="/events" element={
                <ProtectedRoute allowedRoles={['RESIDENT']}>
                  <EventsPage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute allowedRoles={['RESIDENT']}>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}