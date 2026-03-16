"use client";

import { createContext, useContext, useEffect, useState } from "react";

type FontContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
};

const FontSizeContext = createContext<FontContextType | null>(null);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState(16); // smallest size default

  useEffect(() => {
    const saved = localStorage.getItem("reader-font-size");
    if (saved) {
      setFontSizeState(Number(saved));
    }
  }, []);

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem("reader-font-size", size.toString());
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);

  if (!context) {
    throw new Error("useFontSize must be used inside FontSizeProvider");
  }

  return context;
}