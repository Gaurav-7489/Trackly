import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 10 * 60 * 1000;
const AUTO_SWITCH_DELAY = 5000; // 5s after signup success

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // success | error | warn
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  // auto redirect if already logged in
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  function getLoginState() {
    return JSON.parse(localStorage.getItem("login_state")) || {
      attempts: 0,
      blockedUntil: null,
    };
  }

  function saveLoginState(state) {
    localStorage.setItem("login_state", JSON.stringify(state));
  }

  function resetLoginState() {
    localStorage.removeItem("login_state");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);

    const state = getLoginState();

    if (state.blockedUntil && Date.now() < state.blockedUntil) {
      setMessage("Too many attempts. Try again later.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      // ---------------- SIGN UP ----------------
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            username: email.split("@")[0],
          });
        }

        setAwaitingConfirmation(true);
        setMessage(
          "Signup successful. Check your email and confirm. Redirecting to login…"
        );
        setMessageType("success");

        // stay on signup, then switch after delay
        setTimeout(() => {
          setIsSignup(false);
          setAwaitingConfirmation(false);
          setMessage(null);
          setMessageType(null);
        }, AUTO_SWITCH_DELAY);

        resetLoginState();
      }

      // ---------------- LOGIN ----------------
      else {
        if (awaitingConfirmation) {
          setMessage("Please confirm your email before logging in.");
          setMessageType("warn");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          state.attempts += 1;

          if (state.attempts >= MAX_ATTEMPTS) {
            state.blockedUntil = Date.now() + BLOCK_TIME;
            setMessage("Too many failed attempts. Locked for 10 minutes.");
            setMessageType("error");
          } else {
            setMessage(
              `Invalid credentials. Attempts left: ${
                MAX_ATTEMPTS - state.attempts
              }`
            );
            setMessageType("error");
          }

          saveLoginState(state);
          throw error;
        }

        if (!data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          setAwaitingConfirmation(true);
          setMessage("Email not verified yet. Please check your inbox.");
          setMessageType("warn");
          setLoading(false);
          return;
        }

        resetLoginState();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      if (!message) {
        setMessage(err.message);
        setMessageType("error");
      }
    }

    setLoading(false);
  }

  return (
    <div className="auth-wrap">
      <div className="brand">
        <h1>Trackly</h1>
        <p>by "Under Outside The Stationary" clan</p>
      </div>

      <h2>{isSignup ? "Create account" : "Enter workspace"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className={isSignup ? "btn signup" : "btn login"}
        >
          {loading ? "processing..." : isSignup ? "Sign up" : "Login"}
        </button>

        <p className="micro">
          {isSignup
            ? "Create once. Verify email. Done."
            : "Welcome back. Log in to continue."}
        </p>
      </form>

      {message && (
        <p className={`msg ${messageType}`}>
          {message}
        </p>
      )}

      <button
        className="link"
        onClick={() => {
          setIsSignup(!isSignup);
          setAwaitingConfirmation(false);
          setMessage(null);
          setMessageType(null);
        }}
      >
        {isSignup ? "Already have an account?" : "First time? Create an account"}
      </button>
    </div>
  );
}
