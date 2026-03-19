import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SubscriptionType =
  | "free-trial"
  | "premium"
  | "premium-plus";

export interface User {
  email: string;
  subscription: SubscriptionType;
}

type AuthMode = "login" | "register" | "reset" | "signup-plan";

interface AuthState {
  user: User | null;
  isAuthModalOpen: boolean;
  authMode: AuthMode;
  subscriptionIntent: SubscriptionType | null;
  previousAuthMode: AuthMode | null; // ✅ NEW
}

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
  subscriptionIntent: null,
  previousAuthMode: null, // ✅ NEW
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    openAuthModal: (state, action: PayloadAction<AuthMode | undefined>) => {
      state.isAuthModalOpen = true;
      if (action.payload) {
        state.authMode = action.payload;
      }
    },

    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },

    setAuthMode: (state, action: PayloadAction<AuthMode>) => {
      if (action.payload === "reset") {
        state.previousAuthMode = state.authMode; 
      }

      state.authMode = action.payload;
    },

    setSubscriptionIntent: (
      state,
      action: PayloadAction<SubscriptionType>
    ) => {
      state.subscriptionIntent = action.payload;
    },

    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthModalOpen = false;
      state.subscriptionIntent = null;
      state.previousAuthMode = null; 

      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("postLoginRedirect");
    },

    setSubscription: (
      state,
      action: PayloadAction<SubscriptionType>
    ) => {
      if (state.user) {
        state.user.subscription = action.payload;

        localStorage.setItem("user", JSON.stringify(state.user));
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
  setSubscriptionIntent,
} = authSlice.actions;

export default authSlice.reducer;