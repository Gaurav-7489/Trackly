import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

export default function Header() {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "#0d0d0d",
        borderBottom: "1px solid #222",
        color: "#fff",
      }}
    >
      <div>
        <b>Student Dashboard</b>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {!loading && profile && (
          <span style={{ opacity: 0.85 }}>
            @{profile.username}
          </span>
        )}

        <Link
          to="/profile"
          style={{ color: "#aaa", textDecoration: "none" }}
        >
          Profile
        </Link>

        <button
          onClick={logout}
          style={{
            background: "transparent",
            border: "1px solid #333",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
