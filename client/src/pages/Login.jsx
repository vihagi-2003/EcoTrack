
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [f, setF] = useState({
    email: "",
    password: ""
  });

  const [e, setE] = useState("");

  const { login } = useAuth();
  const nav = useNavigate();

  return (
    <div className="auth">
      <form
        onSubmit={async (x) => {
          x.preventDefault();

          try {
            await login(f);
            nav("/dashboard");
          } catch (e) {
            setE(
              e.response?.data?.message || "Login failed"
            );
          }
        }}
      >
        <h1>EcoTrack Login</h1>

        {e && <p className="error">{e}</p>}

        <input
          placeholder="Email"
          type="email"
          required
          onChange={(e) =>
            setF({ ...f, email: e.target.value })
          }
        />

        <input
          placeholder="Password"
          type="password"
          required
          onChange={(e) =>
            setF({ ...f, password: e.target.value })
          }
        />

        <button>Login</button>

        <p>
          No account? <Link to="/register">Register</Link>
        </p>

        <small>
          Demo: admin@ecotrack.com / 123456
        </small>
      </form>
    </div>
  );
}
