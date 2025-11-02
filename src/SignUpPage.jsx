import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_CRUD_BACKEND_URL;
const MIN_PASSWORD_LENGTH = 8; 

export default function SignUpPage({ switchToLogin }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // --- Client-Side Validation ---
    if (password !== confirmPassword) {
      setError("Error: Passwords do not match.");
      setLoading(false);
      return;
    }
    
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Error: Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      setLoading(false);
      return;
    }
    // ---------------------------------

    const formData = new FormData();
    formData.append("firstname", firstname.trim());
    formData.append("lastname", lastname.trim());
    formData.append("email", email.trim());
    formData.append("password", password); 

    try {
      const response = await fetch(`${BACKEND_URL}/create_user`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Sign-up failed. (Email may be duplicate)");
      }

      setMessage(`Success! Account created for ${email}. You will be redirected to Log In.`);
      setFirstname(""); setLastname(""); setEmail(""); setPassword(""); setConfirmPassword("");
      
      setTimeout(switchToLogin, 3000); 
      
    } catch (err) {
      console.error("Sign-up Error:", err);
      setError(err.message || "An unexpected error occurred during sign-up.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 450, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        ✍️ Create Account
      </h2>

      <form onSubmit={handleSignUp} style={{ marginBottom: "1rem" }}>
        
        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input type="text" id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input type="text" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password (Min {MIN_PASSWORD_LENGTH} Chars)</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Already have an account? 
        <button type="button" onClick={switchToLogin} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginLeft: '5px' }}>
            Log In
        </button>
      </p>
    </div>
  );
}
