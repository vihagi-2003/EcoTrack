
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const [e, setE] = useState("");

  const { register } = useAuth();
  const nav = useNavigate();

  return (
    <div className="auth">
      <form
        onSubmit={async (x) => {
          x.preventDefault();

          try {
            await register(f);
            nav("/dashboard");
          } catch (e) {
            setE(
              e.response?.data?.message ||
              e.message ||
              "Registration failed"
            );
          }
        }}
      >
        <h1>Create Account</h1>

        {e && <p className="error">{e}</p>}

        {["name", "email", "password", "phone", "address"].map((k) => (
          <input
            key={k}
            placeholder={k}
            type={k === "password" ? "password" : "text"}
            required={
              k === "name" ||
              k === "email" ||
              k === "password"
            }
            onChange={(e) =>
              setF({ ...f, [k]: e.target.value })
            }
          />
        ))}

        <button>Register</button>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
