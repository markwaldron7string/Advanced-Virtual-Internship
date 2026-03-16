"use client";

import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { openAuthModal } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="settings">
        <h1>Settings</h1>

        <div className="settings__login">
          <Image src="/assets/login.png" alt="Login" width={450} height={310} />

          <p>Log in to your account to see your details.</p>

          <button
            className="settings-btn"
            onClick={() => dispatch(openAuthModal())}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings">
      <h1>Settings</h1>
      {user.email === "guest@summarist.app" && (
          <button
            className="upgrade-btn"
            onClick={() => router.push("/choose-plan")}
            style={{ marginTop: "12px" }}
          >
            Upgrade
          </button>
        )}
      <div className="settings__section">
        <h3>Your Subscription plan</h3>
        <p>{user.subscription}</p>
      </div>

      <div className="settings__section">
        <h3>Email</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
