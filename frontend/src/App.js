import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import ViewEvents from './pages/ViewEvents'
function App() {
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
              element={<Login />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
            <Route
              path="/events/:id"
              element={<Event />}
            />
            <Route
              path="/bookmovie/:id"
              element={<BookMovie />}
            />
            <Route
              path="/booktrain/:id"
              element={<BookTrain />}
            />
            {/* <Route
              path="/create-event"
              element={<CreateEvent />}
            />
            <Route
              path="/view-events"
              element={<ViewEvents />}
            /> */}
            <Route
              path="/edit-profile"
              element={<EditProfile />}
            />
            <Route
              path="/bookings"
              element={<Bookings />}
            />
            <Route
              path="/change-password"
              element={<ChangePassword />}
            />
            <Route
              path="/booking-summary"
              element={<BookingSummary />}
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
              element={<ForgotPassword />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
