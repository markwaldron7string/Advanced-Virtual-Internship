"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { subscriptionIntent } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("checkoutEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // Luhn algorithm (real card validation)
const isValidCard = (num: string) => {
  const cleaned = num.replace(/\s/g, "");
  if (!/^\d{16}$/.test(cleaned)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const isFutureExpiry = (exp: string) => {
  if (!/^\d{2}\/\d{2}$/.test(exp)) return false;

  const [month, year] = exp.split("/").map(Number);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  return year > currentYear || (year === currentYear && month >= currentMonth);
};

  /* ---------------- HANDLE PAYMENT ---------------- */

const handlePayment = () => {
  setError("");

    if (!isValidCard(cardNumber)) {
      setError("Invalid card number");
      return;
    }

    if (!isFutureExpiry(expiry)) {
      setError("Invalid or expired date");
      return;
    }

    if (!/^\d{3,4}$/.test(cvc)) {
      setError("Invalid CVC");
      return;
    }

    dispatch(
      login({
        email: email || "test@email.com",
        subscription: 
          subscriptionIntent === "premium-plus"
          ? "premium-plus"
          : "premium",
      })
    );

    localStorage.removeItem("checkoutEmail");
    router.push("/for-you");
  };

  /* ---------------- SAFETY ---------------- */

  if (!subscriptionIntent) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No plan selected</h2>
        <p>Please go back and choose a plan.</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT SIDE */}
        <div className="checkout-left">
          <h2>
            <span style={{ color: "#f59e0b", fontSize: "12px" }}>
              TEST MODE
            </span>
          </h2>
          <h2>Summarist</h2>

          <p style={{ marginTop: "20px", color: "#6b7280" }}>
            Subscribe to Summarist {subscriptionIntent}
          </p>

          <h1>{subscriptionIntent === "premium-plus" ? "$99.00" : "$9.99"}</h1>

          <p>per {subscriptionIntent === "premium-plus" ? "year" : "month"}</p>

          <a
            href="https://docs.stripe.com/testing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              marginTop: "30px",
              color: "#2563eb",
            }}
          >
            Use Stripe test cards →
          </a>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <h3>Contact information</h3>

          <input value={email} disabled style={{ marginBottom: "20px" }} />

          <h3>Payment method</h3>

            <div className="card-logos">
              <div className="visa-logo">
                <img src="/assets/visa.png" alt="visa" />
              </div>
              <div className="mc-logo">
                <img src="/assets/mastercard.png" alt="mc" />
              </div>
              <div className="amex-logo">
                <img src="/assets/amex.png" alt="amex" />
              </div>
            </div>
              

          <div className="card-container">
            <div className="card-row">
              <input 
              className="card-input" 
              placeholder="1234 1234 1234 1234"
              value={cardNumber}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "").slice(0, 16);
                val = val.replace(/(.{4})/g, "$1 ").trim();
                setCardNumber(val);
              }} 
            />
              
            </div>

            <div className="card-row split">
              <input
                className="card-input"
                placeholder="MM / YY"
                maxLength={5}
                value={expiry}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "").slice(0, 4);

                  if (val.length >= 3) {
                    val = val.slice(0, 2) + "/" + val.slice(2);
                  }

                  setExpiry(val);
                }}
              />

              <input 
                className="card-input" 
                placeholder="CVC" 
                maxLength={4} 
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <div className="card-name__input">
            <input placeholder="Cardholder Name" />
          </div>

          <button className="checkout-btn" onClick={handlePayment}>
            Subscribe
          </button>
          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
          )}

          <p style={{ fontSize: "12px", marginTop: "24px", color: "#6b7280" }}>
            This is a test payment. Use Stripe test card: 4242 4242 4242 4242
          </p>
          <p style={{ fontSize: "12px", marginTop: "12px", color: "#6b7280" }}>
            Use any future expiration date and any numerical 3-digit CVC
          </p>
        </div>
      </div>
    </div>
  );
}
