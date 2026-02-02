import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { mapAuthError } from "../lib/authErrors";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // 🔥 AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    let result;

    try {
      if (isSignup) {
        result = await supabase.auth.signUp({
          email,
          password,
        });

        if (result.error) {
          throw result.error;
        }

        // ✅ CREATE PROFILE IMMEDIATELY
        await supabase.from("profiles").insert({
          id: result.data.user.id,
          username: email.split("@")[0],
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (result.error) {
          throw result.error;
        }
      }

      // ❌ no manual navigate
      // AuthContext + useEffect handles redirect
    } catch (err) {
      console.error(err);
      const readableError = mapAuthError(err, isSignup);
      setToast(readableError || "Something went wrong");
    }

    setLoading(false);
  }

  return (
    <>
      <div style={{ padding: "40px", maxWidth: "400px" }}>
        <h1>{isSignup ? "Create Account" : "Login"}</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br /><br />

          <button type="submit" disabled={loading}>
            {loading
              ? "processing..."
              : isSignup
              ? "Create account"
              : "Login"}
          </button>
        </form>

        <br />

        <button onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Already have an account? Login"
            : "New here? Create account"}
        </button>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}
