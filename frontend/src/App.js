import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login';
import Signup from './pages/Signup';
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Event from './pages/Event';
import BookMovie from './pages/BookMovie';
import BookTrain from './pages/BookTrain'
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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;
