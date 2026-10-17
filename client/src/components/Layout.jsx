
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <>
      <header>
        <b>🌱 EcoTrack</b>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/schedules">Schedules</Link>
          <Link to="/complaints">Complaints</Link>
          <Link to="/recycling">Recycling</Link>
        </nav>

        <span>
          {user?.name}
          <button
            onClick={() => {
              logout();
              nav("/login");
            }}
          >
            Logout
          </button>
        </span>
      </header>

      <main>{children}</main>
    </>
  );
}
