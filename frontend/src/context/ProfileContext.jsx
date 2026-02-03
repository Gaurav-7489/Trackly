import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);

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

    let cancelled = false;

    async function loadOrCreateProfile() {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (cancelled) return;

      // profile exists
      if (data) {
        setProfile(data);
        setLoading(false);
        return;
      }

      // profile missing → create
      if (error?.code === "PGRST116") {
        const { data: created, error: insertError } =
          await supabase
            .from("profiles")
            .insert({
              id: user.id,
              username: user.email?.split("@")[0] ?? "user",
            })
            .select()
            .single();

        if (!cancelled) {
          if (insertError) {
            console.error("Profile create failed:", insertError);
            setProfile(null);
          } else {
            setProfile(created);
          }
        }
      } else {
        console.error("Profile fetch failed:", error);
        setProfile(null);
      }

      if (!cancelled) setLoading(false);
    }

    loadOrCreateProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        loading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return ctx;
}
