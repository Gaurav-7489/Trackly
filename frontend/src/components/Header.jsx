import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const { theme, toggleTheme } = useTheme(); // ✅ ONLY source of truth

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="header-left">
        <span className="brand">Trackly</span>
      </div>

      <div className="header-right">
        {!loading && profile && (
          <span className="username">@{profile.username}</span>
        )}

        <Link to="/profile" className="profile-link">
          Profile
        </Link>

        {/* THEME TOGGLE */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        <button onClick={logout} className="logout-btn">
          Log out
        </button>
      </div>
    </header>
  );
}
