import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import EventFormPage from "./pages/EventFormPage";
import BookingsPage from "./pages/BookingsPage";
import BookingFormPage from "./pages/BookingFormPage";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsPage />} />

          <Route
            path="/events/new"
            element={
              <AdminProtectedRoute>
                <EventFormPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/events/edit/:id"
            element={
              <AdminProtectedRoute>
                <EventFormPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings/new"
            element={
              <ProtectedRoute>
                <BookingFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings/edit/:id"
            element={
              <ProtectedRoute>
                <BookingFormPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
