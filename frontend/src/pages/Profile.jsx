import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useProfile } from "../context/ProfileContext";

export default function Profile() {
  const { profile, setProfile, loading } = useProfile();
  const [username, setUsername] = useState(profile?.username || "");

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile found</p>;

  async function save() {
    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, username });
      alert("Profile updated");
    }
  }

  return (
    <div>
      <h2>User Profile</h2>

      <label>Username</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={save}>Save</button>
    </div>
  );
}
