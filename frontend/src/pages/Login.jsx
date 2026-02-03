import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 10 * 60 * 1000;
const CONFIRM_RESET_TIME = 15 * 1000; // 15s auto reset

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  // auto redirect if already logged in
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  // 🔁 AUTO RESET waiting state (react-style "refresh")
  useEffect(() => {
    const waiting = localStorage.getItem("awaiting_email_confirmation");

    if (waiting) {
      setAwaitingConfirmation(true);
      setMessage(
        "Email sent. Please confirm it, then log in."
      );

      const timer = setTimeout(() => {
        localStorage.removeItem("awaiting_email_confirmation");
        setAwaitingConfirmation(false);
        setMessage(null);
      }, CONFIRM_RESET_TIME);

      return () => clearTimeout(timer);
    }
  }, []);

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

    const state = getLoginState();

    if (state.blockedUntil && Date.now() < state.blockedUntil) {
      setMessage("Too many attempts. Try again in a few minutes.");
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

        // 🔑 mark waiting state
        localStorage.setItem("awaiting_email_confirmation", "true");

        setIsSignup(false);
        setAwaitingConfirmation(true);
        setMessage(
          "Confirmation email sent. Please verify it, then log in."
        );

        resetLoginState();
      }

      // ---------------- LOGIN ----------------
      else {
        if (awaitingConfirmation) {
          setMessage("Waiting for email confirmation.");
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
          } else {
            setMessage(
              `Invalid credentials. Attempts left: ${
                MAX_ATTEMPTS - state.attempts
              }`
            );
          }

          saveLoginState(state);
          throw error;
        }

        // 🔐 email verification check
        if (!data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          setAwaitingConfirmation(true);
          setMessage(
            "Email not verified yet. Please confirm the email."
          );
          setLoading(false);
          return;
        }

        localStorage.removeItem("awaiting_email_confirmation");
        resetLoginState();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      if (!message) setMessage(err.message);
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
          disabled={loading || awaitingConfirmation}
          className={isSignup ? "btn signup" : "btn login"}
        >
          {loading
            ? "processing..."
            : awaitingConfirmation
            ? "Waiting for confirmation…"
            : isSignup
            ? "Sign up"
            : "Login"}
        </button>

        <p className="micro">
          {isSignup
            ? "One-time signup. Email verification required."
            : awaitingConfirmation
            ? "Confirm the email, then try logging in."
            : "Welcome back. Let’s continue where you left off."}
        </p>
      </form>

      {message && <p className="msg">{message}</p>}

      <button
        className="link"
        onClick={() => {
          setIsSignup(!isSignup);
          setAwaitingConfirmation(false);
          setMessage(null);
          localStorage.removeItem("awaiting_email_confirmation");
        }}
      >
        {isSignup ? "Already have an account?" : "First time? Create an account"}
      </button>
    </div>
  );
}
