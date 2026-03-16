import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SubscriptionType =
  | "free-trial"
  | "premium"
  | "premium-plus";

export interface User {
  email: string;
  subscription: SubscriptionType;
}

type AuthMode = "login" | "register" | "reset";

interface AuthState {
  user: User | null;
  isAuthModalOpen: boolean;
  authMode: AuthMode;
}

/* -------------------------
   Restore user from storage
------------------------- */

const storedUser =
  typeof window !== "undefined"
    ? localStorage.getItem("user")
    : null;

const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  isAuthModalOpen: false,
  authMode: "login",
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
      state.authMode = "login";
    },

    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },

    setAuthMode: (
      state,
      action: PayloadAction<AuthMode>
    ) => {
      state.authMode = action.payload;
    },

    /* -------------------------
       LOGIN
    ------------------------- */

    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthModalOpen = false;

      localStorage.setItem(
        "user",
        JSON.stringify(action.payload)
      );
    },

    /* -------------------------
       LOGOUT
    ------------------------- */

    logout: (state) => {
      state.user = null;

      localStorage.removeItem("user");
      localStorage.removeItem("postLoginRedirect");
    },

    /* -------------------------
       SUBSCRIPTION UPDATE
    ------------------------- */

    setSubscription: (
      state,
      action: PayloadAction<SubscriptionType>
    ) => {
      if (state.user) {
        state.user.subscription = action.payload;

        localStorage.setItem(
          "user",
          JSON.stringify(state.user)
        );
      }
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  setAuthMode,
  login,
  logout,
  setSubscription,
} = authSlice.actions;

export default authSlice.reducer;