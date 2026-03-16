"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { FiMenu } from "react-icons/fi";
import { FontSizeProvider } from "@/context/FontSizeContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <FontSizeProvider>
      <div className="app-layout">
        <Sidebar open={menuOpen} setOpen={setMenuOpen} />

        <div className="app-content">
          <div className="page-toolbar">
            <div className="page-toolbar__inner">
              <SearchBar />

              <button
                className="mobile-menu-btn"
                onClick={() => setMenuOpen(true)}
              >
                <FiMenu size={22} />
              </button>
            </div>
          </div>

          <div className="page-container">{children}</div>
        </div>

        {menuOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </FontSizeProvider>
  );
}