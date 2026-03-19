"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { closeAuthModal, login, setAuthMode } from "@/redux/slices/authSlice";

import {
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import Image from "next/image";

export default function AuthModal() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isAuthModalOpen, authMode, subscriptionIntent, previousAuthMode } =
    useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  if (!isAuthModalOpen) return null;

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter email and password");
        setLoading(false);
        return;
      }

      if (!email.includes("@") || !email.includes(".")) {
        setError("Enter a valid email");
        setLoading(false);
        return;
      }

      if (subscriptionIntent && authMode === "signup-plan") {
        localStorage.setItem("checkoutEmail", email);
        dispatch(closeAuthModal());
        router.push("/checkout");
        return;
      }

      dispatch(
        login({
          email,
          subscription: "free-trial",
        })
      );

      const redirect = localStorage.getItem("postLoginRedirect");

      if (redirect) {
        localStorage.removeItem("postLoginRedirect");
        router.push(redirect);
      } else {
        router.push("/for-you");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GOOGLE LOGIN ---------------- */

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const email = res.user.email!;

      if (subscriptionIntent && authMode === "signup-plan") {
        localStorage.setItem("checkoutEmail", email);

        dispatch(closeAuthModal());

        router.push("/checkout");
        return;
      }

      dispatch(
        login({
          email,
          subscription: "free-trial",
        }),
      );

      const redirect = localStorage.getItem("postLoginRedirect");

      if (redirect) {
        localStorage.removeItem("postLoginRedirect");
        router.push(redirect);
      } else {
        router.push("/for-you");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- GUEST LOGIN ---------------- */

  const handleGuestLogin = () => {
    dispatch(
      login({
        email: "guest@summarist.app",
        subscription: "free-trial",
      }),
    );

    const redirect = localStorage.getItem("postLoginRedirect");

    if (redirect) {
      localStorage.removeItem("postLoginRedirect");
      router.push(redirect);
    } else {
      router.push("/for-you");
    }
  };

  /* ---------------- RESET PASSWORD ---------------- */

  const handleResetPassword = async () => {
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");

      dispatch(setAuthMode(previousAuthMode || "login")); // ✅ FIX
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* ---------------- UI ---------------- */

  const isSignupPlan = authMode === "signup-plan";

  return (
    <div
      className="auth-modal__overlay"
      onClick={() => dispatch(closeAuthModal())}
    >
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="auth-modal__close"
          onClick={() => dispatch(closeAuthModal())}
        >
          ✕
        </button>

        <h2 className="auth-modal__title">
          {authMode === "login" && "Log in to Summarist"}
          {authMode === "register" && "Sign up to Summarist"}
          {authMode === "signup-plan" && "Sign up for Summarist"}
          {authMode === "reset" && "Reset your password"}
        </h2>

        {(authMode === "login" || authMode === "signup-plan") && (
          <>
            {!isSignupPlan && (
              <>
                <button
                  className="auth-modal__guest"
                  onClick={handleGuestLogin}
                >
                  Login as a Guest
                </button>

                <div className="auth-modal__divider">
                  <span>or</span>
                </div>
              </>
            )}

            <button className="auth-modal__google" onClick={handleGoogleLogin}>
              <Image
                src="/assets/google.png"
                alt="google"
                width={18}
                height={18}
              />
              {isSignupPlan ? "Sign up with Google" : "Login with Google"}
            </button>

            <div className="auth-modal__divider">
              <span>or</span>
            </div>

            <div className="auth-modal__form">
              <input
                className="auth-modal__input"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="auth-modal__input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p style={{ color: "red" }}>{error}</p>}

              <button className="btn auth-modal__submit" onClick={handleSubmit}>
                {isSignupPlan ? "Sign up" : "Login"}
              </button>

              <p className="auth-modal__forgot">
                <span onClick={() => dispatch(setAuthMode("reset"))}>
                  Forgot your password?
                </span>
              </p>
            </div>
          </>
        )}

        {authMode === "reset" && (
          <>
            <div className="auth-modal__form">
              <input
                className="auth-modal__input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && <p style={{ color: "red" }}>{error}</p>}

              <button
                className="btn auth-modal__submit"
                onClick={handleResetPassword}
              >
                Send reset password link
              </button>
            </div>

            <p className="auth-modal__switch">
              <span
                onClick={() =>
                  dispatch(setAuthMode(previousAuthMode || "login"))
                }
              >
                Go back
              </span>
            </p>
          </>
        )}

        {authMode === "login" && (
          <p className="auth-modal__switch">
            Don't have an account?{" "}
            <span
              onClick={() => {
                dispatch(closeAuthModal());
                router.push("/choose-plan");
              }}
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
