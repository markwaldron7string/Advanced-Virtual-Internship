"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { openAuthModal } from "@/redux/slices/authSlice";

export default function Nav() {
  const dispatch = useDispatch();

  return (
    <nav className="nav">
      <div className="nav__wrapper">
        <figure> 
          <Link href="for-you" className="nav__img--mask">
            <img src="/assets/logo.png" alt="logo" />
          </Link>
        </figure>

        <ul className="nav__list--wrapper">
          <li
            className="nav__list nav__list--login"
            onClick={() => dispatch(openAuthModal("login"))}
          >
            Login
          </li>

          <li className="nav__list nav__list--mobile">About</li>
          <li className="nav__list nav__list--mobile">Contact</li>
          <li className="nav__list nav__list--mobile">Help</li>
        </ul>
      </div>
    </nav>
  );
}