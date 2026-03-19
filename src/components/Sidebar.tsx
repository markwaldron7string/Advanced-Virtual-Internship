"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { openAuthModal, logout } from "@/redux/slices/authSlice";
import { useFontSize } from "@/context/FontSizeContext";

import {
  AiOutlineHome,
  AiOutlineBook,
  AiOutlineHighlight,
  AiOutlineSearch,
  AiOutlineSetting,
  AiOutlineQuestionCircle,
  AiOutlineLogin,
} from "react-icons/ai";

import { RiFontSize } from "react-icons/ri";

import { useEffect, useRef, useState } from "react";

type SidebarProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { fontSize, setFontSize } = useFontSize();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;
  const isPlayerPage = pathname?.startsWith("/player");

  const fontSizes = [16, 18, 20, 22];
  const activeIndex = fontSizes.indexOf(fontSize);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  const logoLink = pathname === "/for-you" ? "/" : "/for-you";

  useEffect(() => {
    const activeButton = buttonRefs.current[activeIndex];
    const indicator = indicatorRef.current;

    if (activeButton && indicator) {
      indicator.style.left = `${activeButton.offsetLeft + activeButton.offsetWidth * 0.2}px`;
      indicator.style.width = `${activeButton.offsetWidth * 0.6}px`;
    }
  }, [activeIndex]);

  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      {/* LOGO */}
      <Link href={logoLink} className="sidebar__logo">
        <Image
          src="/assets/logo.png"
          alt="Summarist"
          width={140}
          height={32}
          priority
        />
      </Link>

      {/* NAV */}
      <nav className="sidebar__nav">
        <Link
          href="/for-you"
          className={`sidebar__item ${
            isActive("/for-you") ? "sidebar__item--active" : ""
          }`}
        >
          <span className="sidebar__indicator" />
          <AiOutlineHome />
          <span>For you</span>
        </Link>

        <Link
          href="/library"
          className={`sidebar__item ${
            isActive("/library") ? "sidebar__item--active" : ""
          }`}
        >
          <span className="sidebar__indicator" />
          <AiOutlineBook />
          <span>My Library</span>
        </Link>

        <div className="sidebar__item sidebar__item--disabled">
          <AiOutlineHighlight />
          <span>Highlights</span>
        </div>

        <div className="sidebar__item sidebar__item--disabled">
          <AiOutlineSearch />
          <span>Search</span>
        </div>

        {/* FONT SIZE CONTROLS (ONLY ON PLAYER PAGE) */}
        {isPlayerPage && (
          <div className="sidebar__font-size">
            <div className="sidebar__font-buttons">
              {fontSizes.map((size, index) => (
                <button
                  key={size}
                  ref={(el) => {
                    if (el) buttonRefs.current[index] = el;
                  }}
                  className={`font-btn font-${index}`}
                  onClick={() => setFontSize(size)}
                >
                  <RiFontSize />
                </button>
              ))}

              {/* Sliding underline */}
              <div ref={indicatorRef} className="sidebar__font-indicator" />
            </div>
          </div>
        )}
      </nav>

      {/* FOOTER */}
      <div className="sidebar__footer">
        <Link
          href="/settings"
          className={`sidebar__item ${
            isActive("/settings") ? "sidebar__item--active" : ""
          }`}
        >
          <span className="sidebar__indicator" />
          <AiOutlineSetting />
          <span>Settings</span>
        </Link>

        <div className="sidebar__item sidebar__item--disabled">
          <AiOutlineQuestionCircle />
          <span>Help & Support</span>
        </div>

        <div
          className="sidebar__item"
          onClick={() => {
            if (!mounted) return;

            user
              ? dispatch(logout())
              : dispatch(openAuthModal("login"));
          }}
        >
          <span className="sidebar__indicator" />
          <AiOutlineLogin />
          <span>{mounted && user ? "Logout" : "Login"}</span>
        </div>
      </div>
    </aside>
  );
}
