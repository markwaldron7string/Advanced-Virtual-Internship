"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { openAuthModal } from "@/redux/slices/authSlice";
import Image from "next/image";
import { HiOutlineBookOpen, HiOutlineMicrophone } from "react-icons/hi";
import {
  FaBookmark,
  FaRegBookmark,
  FaRegClock,
  FaRegLightbulb,
  FaRegStar,
} from "react-icons/fa";
import { CiMicrophoneOn } from "react-icons/ci";

type Book = {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  averageRating: number;
  totalRating: number;
  keyIdeas: number;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
  subscriptionRequired: boolean;
};

function formatDuration(seconds?: number | null) {
  if (!seconds) return "";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(
      `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBook(data);

        const stored = localStorage.getItem("savedBooks");

        if (stored) {
          const savedBooks = JSON.parse(stored);
          const exists = savedBooks.find((b: Book) => b.id === data.id);

          if (exists) setSaved(true);
        }

        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!book?.audioLink) return;

    const audio = new Audio(book.audioLink);

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
  }, [book]);

  const handleRead = () => {
    if (!user) {
      localStorage.setItem(
        "postLoginRedirect",
        `/player/${book?.id}`
      );

      dispatch(openAuthModal());
      return;
    }

    if (book?.subscriptionRequired && user.subscription === "free-trial") {
      router.push(
        `/choose-plan?redirect=/player/${book?.id}`
      );
      return;
    }

    router.push(`/player/${book?.id}`);
  };

  const handleListen = () => {
    if (!user) {
      localStorage.setItem(
        "postLoginRedirect",
        `/player/${book?.id}?play=true`
      );

      dispatch(openAuthModal());
      return;
    }

    if (book?.subscriptionRequired && user.subscription === "free-trial") {
      router.push(
        `/choose-plan?redirect=/player/${book?.id}?play=true`
      );
      return;
    }

    router.push(`/player/${book?.id}?play=true`);
  };

  const handleSaveBook = () => {
    if (!book) return;

    const stored = localStorage.getItem("savedBooks");

    let savedBooks = stored ? JSON.parse(stored) : [];

    const exists = savedBooks.find((b: Book) => b.id === book.id);

    if (exists) {
      savedBooks = savedBooks.filter((b: Book) => b.id !== book.id);
      setSaved(false);
    } else {
      savedBooks.push(book);
      setSaved(true);
    }

    localStorage.setItem("savedBooks", JSON.stringify(savedBooks));
  };

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="book-page">
      <div className="book-page__grid">
        <div className="book-page__content">
          <h1>
            {book.title}
            {book.subscriptionRequired && !user && (
              <span> (Premium)</span>
            )}
          </h1>

          <h3>{book.author}</h3>

          <p className="book-page__subtitle">{book.subTitle}</p>

          <div className="book-page__meta">
            <span>
              <FaRegStar size={18} /> {book.averageRating} (
              {book.totalRating} ratings)
            </span>

            <span>
              <FaRegClock size={18} /> {formatDuration(duration)}
            </span>

            <span>
              <CiMicrophoneOn size={23} /> Audio & Text
            </span>

            <span>
              <FaRegLightbulb size={18} /> {book.keyIdeas} Key ideas
            </span>
          </div>

          <div className="book-page__actions">
            <button className="book-btn" onClick={handleRead}>
              <HiOutlineBookOpen size={18} />
              Read
            </button>

            <button className="book-btn" onClick={handleListen}>
              <HiOutlineMicrophone size={18} />
              Listen
            </button>
          </div>

          <button
            className={`book-page__library ${saved ? "saved" : ""}`}
            onClick={handleSaveBook}
          >
            {saved ? (
              <>
                <FaBookmark size={24} />
                Saved in My Library
              </>
            ) : (
              <>
                <FaRegBookmark size={24} />
                Add title to My Library
              </>
            )}
          </button>

          <h4 className="book-section-title">What's it about?</h4>

          <div className="book-tags">
            {book.tags?.map((tag) => (
              <span key={tag} className="book-tag">
                {tag}
              </span>
            ))}
          </div>

          <p className="book-description">{book.bookDescription}</p>

          <h4 className="book-section-title">About the author</h4>

          <p className="book-description">{book.authorDescription}</p>
        </div>

        <div className="book-page__image">
          <Image
            src={book.imageLink}
            alt={book.title}
            width={240}
            height={360}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}