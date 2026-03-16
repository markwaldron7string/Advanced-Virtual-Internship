"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { MdAccessTime, MdClose } from "react-icons/md";
import Skeleton from "@/components/Skeleton";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  audioLink: string;
};

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [durations, setDurations] = useState<Record<string, string>>({});

  const searchRef = useRef<HTMLDivElement>(null);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);

      fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${query}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    results.forEach((book) => {
      if (!book.audioLink || durations[book.id]) return;

      const audio = new Audio(book.audioLink);

      audio.addEventListener("loadedmetadata", () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60)
          .toString()
          .padStart(2, "0");

        setDurations((prev) => ({
          ...prev,
          [book.id]: `${minutes}:${seconds}`,
        }));
      });
    });
  }, [results]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setResults([]);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="search" ref={searchRef}>
      <input
        className="search__input"
        placeholder="Search for books"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query ? (
        <button type="button" className="search__button" onClick={clearSearch}>
          <MdClose size={18} />
        </button>
      ) : (
        <button type="button" className="search__button" aria-label="Search">
          <FaSearch size={14} />
        </button>
      )}

      {loading && (
        <div className="search__results">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="search__result">
              <Skeleton width={70} height={80} />

              <div style={{ flex: 1 }}>
                <Skeleton width="80%" height={14} />
                <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
                <Skeleton width="20%" height={12} style={{ marginTop: 6 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="search__results">
          {results.map((book) => (
            <div
              key={book.id}
              className="search__result"
              onClick={() => {
                setQuery("");
                setResults([]);
                router.push(`/book/${book.id}`);
              }}
            >
              <img
                src={book.imageLink}
                alt={book.title}
                className="search__image"
              />

              <div className="search__info">
                <strong>{book.title}</strong>

                <span className="search__author">{book.author}</span>

                <span className="search__duration">
                  <MdAccessTime size={12} />
                  {durations[book.id]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
