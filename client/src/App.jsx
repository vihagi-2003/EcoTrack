
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import NewRequest from "./pages/NewRequest";
import Schedules from "./pages/Schedules";
import Complaints from "./pages/Complaints";
import Recycling from "./pages/Recycling";

import "./styles.css";

const P = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={<P><Dashboard /></P>}
          />

          <Route
            path="/requests"
            element={<P><Requests /></P>}
          />

          <Route
            path="/new-request"
            element={<P><NewRequest /></P>}
          />

          <Route
            path="/schedules"
            element={<P><Schedules /></P>}
          />

          <Route
            path="/complaints"
            element={<P><Complaints /></P>}
          />

          <Route
            path="/recycling"
            element={<P><Recycling /></P>}
          />

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
