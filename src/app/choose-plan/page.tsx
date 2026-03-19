"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { openAuthModal, setSubscriptionIntent } from "@/redux/slices/authSlice";

import { IoDocumentTextSharp } from "react-icons/io5";
import { PiPottedPlantFill } from "react-icons/pi";
import { FaHandshake } from "react-icons/fa";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function ChoosePlanPage() {
  const dispatch = useDispatch();
  const [plan, setPlan] = useState<"premium" | "premium-plus">("premium-plus");
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const isPlus = plan === "premium-plus";

  const faqs = [
    {
      question: "How does the free 7-day trial work?",
      answer: "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
    },
    {
      question: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
      answer: "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
    },
    {
      question: "What's included in the Premium plan?",
      answer: "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
    },
    {
      question: "Can I cancel during my trial or subscription?",
      answer: "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
    },
  ];

  return (
    <div className="pricing">
      {/* HERO */}
      <section className="choose-hero">
        <h1>Get unlimited access to many amazing books to read</h1>

        <p>Turn ordinary moments into amazing learning opportunities</p>

        <div className="choose-hero__arch">
          <img src="/assets/pricing-top.png" alt="pricing" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="pricing-features">
        <div className="pricing-feature">
          <IoDocumentTextSharp size={60} />
          <p>
            <strong>Key ideas in few minutes</strong> with many books to read
          </p>
        </div>

        <div className="pricing-feature">
          <PiPottedPlantFill size={60} />
          <p>
            <strong>3 million people</strong> growing with Summarist everyday
          </p>
        </div>

        <div className="pricing-feature">
          <FaHandshake size={60} />
          <p>
            <strong>Precise recommendations</strong> collections curated by
            experts
          </p>
        </div>
      </section>

      {/* PLANS */}
      <section className="pricing-plans">
        <h2>Choose the plan that fits you</h2>

        {/* PREMIUM PLUS */}
        <div
          className={`pricing-plan ${isPlus ? "active" : ""}`}
          onClick={() => setPlan("premium-plus")}
        >
          <input type="radio" checked={isPlus} readOnly />

          <span className="plan-radio"></span>

          <div className="plan-content">
            <h3>Premium Plus Yearly</h3>
            <p className="price">$99.99/year</p>
            <span>7-day free trial included</span>
          </div>
        </div>

        <div className="pricing-or">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        {/* PREMIUM */}
        <div
          className={`pricing-plan ${!isPlus ? "active" : ""}`}
          onClick={() => setPlan("premium")}
        >
          <input type="radio" checked={!isPlus} readOnly />

          <span className="plan-radio"></span>

          <div className="plan-content">
            <h3>Premium Monthly</h3>
            <p className="price">$9.99/month</p>
            <span>No trial included</span>
          </div>
        </div>

        {/* BUTTON */}
        <button
          className="pricing-btn"
          onClick={() => {
            dispatch(setSubscriptionIntent(isPlus ? "premium-plus" : "premium"));
            dispatch(openAuthModal("signup-plan"));
          }}
        >
          {isPlus ? "Start your free 7-day trial" : "Start your first month"}
        </button>

        <p className="pricing-note">
          {isPlus
            ? "Cancel your trial at any time before it ends, and you won’t be charged."
            : "30-day money back guarantee, no questions asked."}
        </p>
      </section>

      <section className="pricing-faq">
        {faqs.map((faq, index) => (
          <FAQ
            key={index}
            question={faq.question}
            answer={faq.answer}
            open={openFAQ === index}
            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
          />
        ))}
      </section>

      <Footer />
    </div>
  );
}
