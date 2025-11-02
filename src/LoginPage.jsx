import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_CRUD_BACKEND_URL;
console.log(BACKEND_URL)

export default function LoginPage({ onLoginSuccess, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password);

    try {
      const response = await fetch(`${BACKEND_URL}/auth`, {
        method: "POST",
        body: formData, 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed.");
      }

      setMessage("Login successful!");
      // Call parent handler to update application state
      onLoginSuccess(data.customer_id, email); 
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        🔑 User Login
      </h2>

      <form onSubmit={handleLogin} style={{ marginBottom: "1rem" }}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>

      {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Don't have an account? 
        <button type="button" onClick={switchToSignup} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginLeft: '5px' }}>
            Sign Up
        </button>
      </p>
    </div>
  );
}