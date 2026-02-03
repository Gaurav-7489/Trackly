import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useProfile } from "../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { profile, setProfile, loading } = useProfile();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    course: "",
    year: "",
    semester: "",
    roll_number: "",
    personal_email: "",
    username: "",
    avatar_url: "",
  });

  const [toast, setToast] = useState(null);

  /* preload */
  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      course: profile.course ?? "",
      year: profile.year ?? "",
      semester: profile.semester ?? "",
      roll_number: profile.roll_number ?? "",
      personal_email: profile.personal_email ?? "",
      username: profile.username ?? "",
      avatar_url: profile.avatar_url ?? "",
    });
  }, [profile]);

  if (loading) return <p>Loading profile…</p>;
  if (!profile) return <p>No profile found</p>;

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop();
    const fileName = `${profile.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      setToast("Avatar upload failed");
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const avatar_url = data.publicUrl;

    await supabase
      .from("profiles")
      .update({ avatar_url })
      .eq("id", profile.id);

    setForm((p) => ({ ...p, avatar_url }));
    setProfile((p) => ({ ...p, avatar_url }));

    setToast("Avatar updated");
    setTimeout(() => setToast(null), 2500);
  }

  async function saveProfile() {
    const { error } = await supabase
      .from("profiles")
      .update(form)
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, ...form });
      setToast("Profile saved");
    } else {
      setToast("Save failed");
    }

    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="profile-card">
      {/* HEADER */}
      <div className="profile-top">
        <h2>Student Profile</h2>
        <button
          className="close-btn"
          onClick={() => navigate("/dashboard")}
        >
          ✕
        </button>
      </div>

      {toast && <div className="profile-toast">{toast}</div>}

      {/* AVATAR */}
      <div className="profile-header">
        <div className="avatar">
          {form.avatar_url ? (
            <img src={form.avatar_url} alt="avatar" />
          ) : (
            <div className="avatar-placeholder">👤</div>
          )}
          <input
            type="file"
            accept="image/*"
            className="avatar-input"
            onChange={handleAvatarUpload}
          />
        </div>

        <div>
          <input
            className="name-input"
            placeholder="Full name"
            value={form.full_name}
            onChange={(e) =>
              updateField("full_name", e.target.value)
            }
          />
          <div className="username">@{form.username}</div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="profile-grid">
        <input
          placeholder="Course"
          value={form.course}
          onChange={(e) => updateField("course", e.target.value)}
        />

        <input
          placeholder="Year"
          value={form.year}
          onChange={(e) => updateField("year", e.target.value)}
        />

        <input
          placeholder="Semester"
          value={form.semester}
          onChange={(e) => updateField("semester", e.target.value)}
        />

        <input
          placeholder="Roll number"
          value={form.roll_number}
          onChange={(e) => updateField("roll_number", e.target.value)}
        />

        <input
          placeholder="Personal email"
          value={form.personal_email}
          onChange={(e) => updateField("personal_email", e.target.value)}
        />
      </div>

      {/* ACTIONS */}
      <div className="profile-actions">
        <button className="save-btn" onClick={saveProfile}>
          Save
        </button>
        <button
          className="secondary-btn"
          onClick={() => navigate("/dashboard")}
        >
          Exit
        </button>
      </div>
    </div>
  );
}
