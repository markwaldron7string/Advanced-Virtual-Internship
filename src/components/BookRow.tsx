"use client";

import { useEffect, useState } from "react";
import BookCard from "./BookCard";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  subscriptionRequired: boolean;
};

export default function BookRow({
  title,
  status,
  single = false,
}: {
  title: string;
  status: "selected" | "recommended" | "suggested";
  single?: boolean;
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=${status}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBooks(data); 
        setLoading(false);
      });
  }, [status]);

  if (loading) {
    return (
      <section className="book-row">
        <h2>{title}</h2>

        <div className="book-row__list">
          {Array.from({ length: single ? 1 : 5 }).map((_, i) => (
            <div key={i} className="book-card skeleton">
              <div className="skeleton__image" />
              <div className="skeleton__text" />
              <div className="skeleton__text short" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="book-row">
      <h2>{title}</h2>
      <div className="book-row__list">
        {single && books.length > 0 ? (
          <BookCard book={books[0]} />
        ) : (
          books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        )}
      </div>
    </section>
  );
}