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
import Skeleton from "@/components/Skeleton"; 

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
      dispatch(openAuthModal("login"));
      return;
    }

    if (book?.subscriptionRequired && user.subscription === "free-trial") {
      router.push(`/choose-plan?redirect=/player/${book?.id}`);
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
      dispatch(openAuthModal("login"));
      return;
    }

    if (book?.subscriptionRequired && user.subscription === "free-trial") {
      router.push(`/choose-plan?redirect=/player/${book?.id}?play=true`);
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

  /* ---------------- SKELETON LOADING ---------------- */

  if (loading) {
    return (
      <div className="book-page">
        <div className="book-page__grid">
          <div className="book-page__content">
            <Skeleton width={500} height={32} />
            <Skeleton width={200} height={30} style={{ marginTop: 12 }} />
            <Skeleton width={400} height={30} style={{ marginTop: 12 }} />

            <div style={{ marginTop: 24 }}>
              <Skeleton width={250} height={20} style={{ marginTop: 12 }} />
              <Skeleton width={250} height={20} style={{ marginTop: 12 }} />
            </div>

            <div className="read-listen__skeleton" style={{ marginTop: 24 }}>
              <Skeleton width={140} height={50} style={{ marginTop: 12 }} />
              <Skeleton width={140} height={50} style={{ marginTop: 12 }} />
            </div>

            <div style={{ marginTop: 24 }}>
              <Skeleton width={300} height={20} />
              <Skeleton width={300} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={300} height={20} style={{ marginTop: 8 }} />
            </div>
            <div style={{ marginTop: 36 }}>
              <Skeleton width={160} height={40} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
            </div>
            <div style={{ marginTop: 36 }}>
              <Skeleton width={160} height={40} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={600} height={20} style={{ marginTop: 8 }} />
            </div>
          </div>

          <div className="book-page__image">
            <Skeleton width={200} height={260} style={{ marginBottom: 96 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!book) return <p>Book not found</p>;

  /* ---------------- REAL UI ---------------- */

  return (
    <div className="book-page">
      <div className="book-page__grid">
        <div className="book-page__content">
          <h1>
            {book.title}
            {book.subscriptionRequired &&
              (!user || user.subscription === "free-trial") && (
                <span> (Premium)</span>
              )}
          </h1>

          <h3>{book.author}</h3>

          <p className="book-page__subtitle">{book.subTitle}</p>

          <div className="book-page__meta">
            <span>
              <FaRegStar size={18} /> {book.averageRating} ({book.totalRating} ratings)
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