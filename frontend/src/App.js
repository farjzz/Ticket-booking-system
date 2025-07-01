import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';
import Login from './pages/login';
import Signup from './pages/Signup';
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Event from './pages/Event';
import BookMovie from './pages/BookMovie';
import BookTrain from './pages/BookTrain'
import ChangePassword from './pages/ChangePassword'
import Bookings from './pages/Bookings'
import EditProfile from './pages/EditProfile'
import BookingSummary from './pages/BookingSummary'
import ViewBooking from './pages/ViewBooking';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CreateEvent from './pages/CreateEvent'
import VendorDashboard from './pages/VendorDashboard';
import VendorTheatre from './pages/VendorTheatre';
import VendorConcert from './pages/VendorConcert';
import VendorTrain from './pages/VendorTrain';
import BookConcert from './pages/BookConcert';
function App() {
  const { user } = useAuthContext()
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : user.role == 'user' ? <Navigate to="/" /> : <Navigate to="/vendor" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : user.role == 'user' ? <Navigate to="/" /> : <Navigate to="/vendor" />}
            />
            <Route
              path="/events/:id"
              element={<Event />}
            />
            <Route
              path="/bookmovie/:id"
              element={user ? <BookMovie /> : <Login />}
            />
            <Route
              path="/booktrain/:id"
              element={user ? <BookTrain /> : <Login />}
            />
            <Route
              path="/bookconcert/:id"
              element={user ? <BookConcert /> : <Login />}
            />
            <Route
              path="/create-event"
              element={<CreateEvent />}
            />
            <Route
              path="/edit-profile"
              element={<EditProfile />}
            />
            <Route
              path="/bookings"
              element={user ? <Bookings /> : <Login />}
            />
            <Route
              path="/change-password"
              element={<ChangePassword />}
            />
            <Route
              path="/booking-summary"
              element={user ? <BookingSummary /> : <Login />}
            />
            <Route
              path="/view-booking"
              element={<ViewBooking />}
            />
            <Route
              path="/reset-password/:token"
              element={<ResetPassword />}
            />
            <Route
              path="/forgot-password"
              element={!user ? <ForgotPassword /> : <Navigate to="/" />}
            />
            <Route
              path="/vendor"
              element={<VendorDashboard />}
            />
            <Route
              path="/vendor-theatre/:id"
              element={<VendorTheatre />}
            />
            <Route
              path="/vendor-concert/:id"
              element={<VendorConcert />}
            />
            <Route
              path="/vendor-train/:id"
              element={<VendorTrain />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
