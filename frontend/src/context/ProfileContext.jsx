import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function loadProfile() {
      setLoading(true);

      // 1️⃣ try fetch
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // 2️⃣ profile exists
      if (data) {
        setProfile(data);
        setLoading(false);
        return;
      }

      // 3️⃣ profile missing → CREATE IT
      if (error?.code === "PGRST116") {
        const { data: created, error: insertError } =
          await supabase
            .from("profiles")
            .insert({
              id: user.id,
              username: user.email.split("@")[0],
            })
            .select()
            .single();

        if (!insertError) {
          setProfile(created);
        } else {
          console.error("Profile create failed:", insertError);
        }
      }

      setLoading(false);
    }

    loadProfile();
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
