import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login.jsx';
import Dashboard from '../features/dashboard/Dashboard.jsx';
import Matches from '../features/matches/Matches.jsx';
import Bookings from '../features/bookings/Bookings.jsx';
import Profile from '../features/profile/Profile.jsx';
import CourtDetailPage from '../features/courts/pages/CourtDetailPage.jsx';
import BottomNavigation from '../shared/components/BottomNavigation.jsx';

function MainLayout({ children }) {
    return (
        <>
            {children}
            <BottomNavigation />
        </>
    );
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Navigate to="/login" replace />} />
                <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
                <Route path="/matches" element={<MainLayout><Matches /></MainLayout>} />
                <Route path="/bookings" element={<MainLayout><Bookings /></MainLayout>} />
                <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
                {/* Trang chi tiết sân — không có BottomNavigation */}
                <Route path="/courts/:id" element={<CourtDetailPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
