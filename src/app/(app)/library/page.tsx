"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { openAuthModal } from "@/redux/slices/authSlice";
import Image from "next/image";
import BookCard from "@/components/BookCard";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  summary: string;
};

export default function LibraryPage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("savedBooks");

    if (stored) {
      setSavedBooks(JSON.parse(stored));
    }
  }, []);

  /* Logged out view */
  if (!user) {
    return (
      <div className="page-content">
        <div className="library-page-container" style={{ textAlign: "center" }}>
          <Image
            src="/assets/login.png"
            alt="Login"
            width={450}
            height={310}
          />

          <h2 style={{ marginTop: "20px" }}>
            Log in to your account to see your library.
          </h2>

          <button
            className="settings-btn"
            style={{ marginTop: "16px" }}
            onClick={() => dispatch(openAuthModal("login"))}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  /* Logged in view (original layout preserved) */
  return (
    <div className="page-content">
      <div className="library-page-container">

        <h2>Saved Books</h2>
        <p>{savedBooks.length} items</p>

        <div className="books-row">
          {savedBooks.length === 0 && (
            <div className="save-fave__books">
              <h3>📚 Save your favorite books! 📖</h3>
              <h4>When you save a book, it will appear here.</h4>
            </div>
          )}

          {savedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

      </div>
    </div>
  );
}