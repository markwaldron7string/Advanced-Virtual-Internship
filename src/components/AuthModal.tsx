"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { closeAuthModal, login, setAuthMode } from "@/redux/slices/authSlice";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import Image from "next/image";

export default function AuthModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthModalOpen, authMode } = useSelector(
    (state: RootState) => state.auth,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  if (!isAuthModalOpen) return null;

  /* ---------------- LOGIN / REGISTER ---------------- */

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (authMode === "login") {
        const res = await signInWithEmailAndPassword(auth, email, password);

        dispatch(
          login({
            email: res.user.email!,
            subscription: "premium-plus",
          }),
        );

        const redirect = localStorage.getItem("postLoginRedirect");

        if (redirect) {
          localStorage.removeItem("postLoginRedirect");
          router.push(redirect);
        } else {
          router.push("/for-you");
        }
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        dispatch(
          login({
            email: res.user.email!,
            subscription: "premium-plus",
          }),
        );
      }
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GOOGLE LOGIN ---------------- */

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);

      dispatch(
        login({
          email: res.user.email!,
          subscription: "premium-plus",
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
        subscription: "Free Trial",
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
      dispatch(setAuthMode("login"));
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* ---------------- UI ---------------- */

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
          {authMode === "reset" && "Reset your password"}
        </h2>

        {/* ---------------- LOGIN ---------------- */}

        {authMode === "login" && (
          <>
            <button className="auth-modal__guest" onClick={handleGuestLogin}>
              Login as a Guest
            </button>

            <div className="auth-modal__divider">
              <span>or</span>
            </div>

            <button className="auth-modal__google" onClick={handleGoogleLogin}>
              <Image
                src="/assets/google.png"
                alt="google"
                width={18}
                height={18}
              />
              Login with Google
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
                Login
              </button>

              <p className="auth-modal__forgot">
                <span onClick={() => dispatch(setAuthMode("reset"))}>
                  Forgot your password?
                </span>
              </p>
            </div>
          </>
        )}

        {/* ---------------- REGISTER ---------------- */}

        {authMode === "register" && (
          <>
            <button className="auth-modal__google" onClick={handleGoogleLogin}>
              <Image
                src="/assets/google.png"
                alt="google"
                width={18}
                height={18}
              />
              Sign up with Google
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

              <button className="btn auth-modal__submit" onClick={handleSubmit}>
                Sign up
              </button>
            </div>
          </>
        )}

        {/* ---------------- RESET PASSWORD ---------------- */}

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
              <span onClick={() => dispatch(setAuthMode("login"))}>
                Go to login
              </span>
            </p>
          </>
        )}

        {/* ---------------- SWITCH ---------------- */}

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

        {authMode === "register" && (
          <p className="auth-modal__switch">
            Already have an account?{" "}
            <span onClick={() => dispatch(setAuthMode("login"))}>Login</span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- ERROR MAPPING ---------------- */

function getFirebaseErrorMessage(code: string) {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-not-found":
      return "User not found.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/email-already-in-use":
      return "Email already in use.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    default:
      return "Something went wrong. Try again.";
  }
}
