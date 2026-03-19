"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSelectedBook,
  getRecommendedBooks,
  getSuggestedBooks,
} from "@/services/books";
import BookCard from "@/components/BookCard";
import { MdPlayCircle } from "react-icons/md";
import Skeleton from "@/components/Skeleton";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IoChevronForward } from "react-icons/io5";

export default function ForYouPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const recommendedRef = useRef<HTMLDivElement>(null);
  const suggestedRef = useRef<HTMLDivElement>(null);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<any[]>([]);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- SCROLL FUNCTION ---------------- */

  const scroll = (ref: React.RefObject<HTMLDivElement>, amount: number) => {
  if (!ref.current) return;

  const el = ref.current;

  const maxScroll = el.scrollWidth - el.clientWidth;

  // If scrolling right at end → jump to start
  if (amount > 0 && el.scrollLeft >= maxScroll - 5) {
    el.scrollTo({ left: 0, behavior: "smooth" });
    return;
  }

  // If scrolling left at start → jump to end
  if (amount < 0 && el.scrollLeft <= 5) {
    el.scrollTo({ left: maxScroll, behavior: "smooth" });
    return;
  }

  // Normal scroll
  el.scrollBy({
    left: amount,
    behavior: "smooth",
  });
};

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    async function fetchBooks() {
      try {
        const selected = await getSelectedBook();
        const recommended = await getRecommendedBooks();
        const suggested = await getSuggestedBooks();

        setSelectedBook(selected);
        setRecommendedBooks(recommended);
        setSuggestedBooks(suggested);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    fetchBooks();
  }, []);

  /* ---------------- AUDIO DURATION ---------------- */

  useEffect(() => {
    if (!selectedBook?.audioLink) return;

    const audio = new Audio(selectedBook.audioLink);

    audio.addEventListener("loadedmetadata", () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60)
        .toString()
        .padStart(2, "0");

      setSelectedDuration(`${minutes} mins ${seconds} secs`);
    });
  }, [selectedBook]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="page-content">
        <div className="page-container">
          <section>
            <h2>Selected just for you</h2>
            <Skeleton width={630} height={200} style={{ borderRadius: 12, marginTop: 12 }} />
          </section>

          <section>
            <h2>Recommended For You</h2><br/>
            <p className="section-subtitle">We think you'll like these</p>

            <div className="books-row">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="book-card">
                  <Skeleton width={160} height={180} style={{ marginTop: 18 }} />
                  <Skeleton width={160} height={14} style={{ marginTop: 8 }} />
                  <Skeleton width={160} height={14} style={{ marginTop: 6 }} />
                  <Skeleton width={160} height={14} style={{ marginTop: 6 }} />
                  <Skeleton width={90} height={14} style={{ marginTop: 6 }} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Suggested Books</h2><br/>
            <p className="section-subtitle">Browse those books</p>

            <div className="books-row">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="book-card">
                  <Skeleton width={160} height={180} style={{ marginTop: 18 }} />
                  <Skeleton width={160} height={14} style={{ marginTop: 8 }} />
                  <Skeleton width={160} height={14} style={{ marginTop: 6 }} />
                  <Skeleton width={160} height={14} style={{ marginTop: 6 }} />
                  <Skeleton width={90} height={14} style={{ marginTop: 6 }} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="page-content">
      {/* SIGN UP BUTTON */}
      {(!user || user.subscription === "free-trial") && (
        <Link href="/choose-plan">
          <button className="signup-btn">Sign Up</button>
        </Link>
      )}

      <div className="page-container">
        {/* SELECTED BOOK */}
        {selectedBook && (
          <section>
            <h2>Selected just for you</h2>

            <div
              className="selected-book"
              onClick={() => router.push(`/book/${selectedBook.id}`)}
            >
              <div className="selected-book__quote">
                {selectedBook.subTitle}
              </div>

              <div className="selected-book__divider"></div>

              <div className="selected-book__cover">
                <img src={selectedBook.imageLink} alt={selectedBook.title} />
              </div>

              <div className="selected-book__info">
                <h3>{selectedBook.title}</h3>
                <p>{selectedBook.author}</p>

                <div className="selected-book__audio">
                  <MdPlayCircle size={12} />
                  <span>{selectedDuration}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* RECOMMENDED */}
        <section>
          <h2>Recommended For You</h2>
          <br />
          <p className="section-subtitle">We think you'll like these</p>

          <div className="carousel-wrapper">

            <div className="books-row" ref={recommendedRef}>
              {recommendedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            <button onClick={() => scroll(recommendedRef, 300)}><IoChevronForward/></button>
          </div>
        </section>

        {/* SUGGESTED */}
        <section>
          <h2>Suggested Books</h2>
          <br />
          <p className="section-subtitle">Browse these books</p>

          <div className="carousel-wrapper">

            <div className="books-row" ref={suggestedRef}>
              {suggestedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            <button onClick={() => scroll(suggestedRef, 300)}><IoChevronForward/></button>
          </div>
        </section>
      </div>
    </div>
  );
}