"use client";

import { FaChevronDown } from "react-icons/fa6";

interface FAQProps {
  question: string;
  answer: string;
  open: boolean;
  onClick: () => void;
}

export default function FAQ({ question, answer, open, onClick }: FAQProps) {
  return (
    <div className={`faq ${open ? "open" : ""}`}>
      <div className="faq-header" onClick={onClick}>
        <h3>{question}</h3>

        <FaChevronDown
          className={`faq-icon ${open ? "rotate" : ""}`}
          size={24}
        />
      </div>

      <div className="faq-content">
        <p>{answer}</p>
      </div>
    </div>
  );
}