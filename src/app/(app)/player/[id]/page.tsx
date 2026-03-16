"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { MdPlayArrow, MdPause, MdReplay10, MdForward10 } from "react-icons/md";
import { useFontSize } from "@/context/FontSizeContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { openAuthModal } from "@/redux/slices/authSlice";

type Book = {
  id: string;
  title: string;
  author: string;
  summary: string;
  audioLink: string;
  imageLink: string;
};

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const autoPlay = searchParams.get("play") === "true";

  const { fontSize } = useFontSize();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* -------------------------------- */
  /* Helper: open login + save redirect */
  /* -------------------------------- */

  const openLogin = () => {
    localStorage.setItem("postLoginRedirect", pathname);
    dispatch(openAuthModal());
  };

  /* -------------------------------- */
  /* Fetch book */
  /* -------------------------------- */

  useEffect(() => {
    if (!id) return;

    fetch(
      `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      });
  }, [id]);

  /* -------------------------------- */
  /* Restore audio progress */
  /* -------------------------------- */

  useEffect(() => {
    if (!book || !audioRef.current) return;

    const savedTime = localStorage.getItem(`audio-progress-${book.id}`);

    if (savedTime) {
      const time = Number(savedTime);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, [book]);

  /* -------------------------------- */
  /* Stop audio if user logs out */
  /* -------------------------------- */

  useEffect(() => {
    if (!user && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [user]);

  if (loading || !book) {
    return <p>Loading player...</p>;
  }

  /* -------------------------------- */
  /* Audio Controls */
  /* -------------------------------- */

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || !book) return;

    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    localStorage.setItem(`audio-progress-${book.id}`, time.toString());
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;

    setDuration(audioRef.current.duration);

    if (autoPlay && user) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const newTime = Number(e.target.value);

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (amount: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = Math.min(
      Math.max(0, audioRef.current.currentTime + amount),
      duration
    );
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="player-layout">
      <main className="player-content">
        <h1>{book.title}</h1>

        {!user ? (
          <div style={{ textAlign: "center"}}>
            <img
              src="/assets/login.png"
              alt="Login"
              style={{ width: "450px" }}
            />

            <h2>
              Log in to your account to read and listen to this book
            </h2>

            <button
              className="settings-btn"
              style={{ marginTop: "16px" }}
              onClick={openLogin}
            >
              Login
            </button>
          </div>
        ) : (
          <p
            className="player__summary"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: fontSize > 18 ? 1.7 : 1.6,
            }}
          >
            {book.summary}
          </p>
        )}
      </main>

      <div className="audio-player">
        <div className="audio-player__left">
          <img
            src={book.imageLink}
            alt={book.title}
            className="audio-player__cover"
          />

          <div className="audio-player__meta">
            <strong>{book.title}</strong>
            <span>{book.author}</span>
          </div>
        </div>

        <div className="audio-player__center">
          <button
            className="player-btn small"
            onClick={() => (user ? skip(-10) : openLogin())}
          >
            <MdReplay10 size={28} />
          </button>

          <button
            className="player-btn main"
            onClick={() => (user ? togglePlay() : openLogin())}
          >
            {isPlaying ? (
              <MdPause size={36} />
            ) : (
              <MdPlayArrow size={36} />
            )}
          </button>

          <button
            className="player-btn small"
            onClick={() => (user ? skip(10) : openLogin())}
          >
            <MdForward10 size={28} />
          </button>
        </div>

        <div className="audio-player__right">
          <span className="time">{formatTime(currentTime)}</span>

          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => (user ? handleSeek(e) : openLogin())}
            className="audio-player__timeline"
            style={{
              ["--progress" as any]: `${
                (currentTime / duration) * 100
              }%`,
            }}
          />

          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={book.audioLink}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          localStorage.removeItem(`audio-progress-${book.id}`);
          setIsPlaying(false);
        }}
      />
    </div>
  );
}