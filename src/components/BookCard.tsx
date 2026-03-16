"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaClock, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function BookCard({ book }: any) {
  const router = useRouter();
  const [duration, setDuration] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!book.audioLink) return;

    const audio = new Audio(book.audioLink);

    audio.addEventListener("loadedmetadata", () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60)
        .toString()
        .padStart(2, "0");

      setDuration(`${minutes}:${seconds}`);
    });
  }, [book.audioLink]);

  return (
    <div
      className="book-card"
      onClick={() => router.push(`/book/${book.id}`)}
    >
      <div className="book-card__image">
        <div className="book-card__bg"></div>

        <img src={book.imageLink} alt={book.title} />

        {book.subscriptionRequired && !user && (
          <span className="book-pill">Premium</span>
        )}
      </div>

      <div className="book-card__info">
        <h3>{book.title}</h3>

        <p className="book-card__author">{book.author}</p>

        <p className="book-card__desc">{book.subTitle}</p>

        <div className="book-card__meta">
          <span>
            <FaClock size={12} />
            {duration}
          </span>

          <span>
            <FaStar size={12} />
            {book.averageRating}
          </span>
        </div>
      </div>
    </div>
  );
}