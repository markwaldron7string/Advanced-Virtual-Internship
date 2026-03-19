# 📚 Summarist Clone – Full Stack Web App

A modern book summary platform inspired by Summarist, built with Next.js, Redux, and Firebase authentication. This app allows users to explore curated book summaries, listen to audio versions, and unlock premium content through a simulated subscription flow.

---

## 🚀 Live Demo

*https://advanced-virtual-internship-pied.vercel.app/*

---

## 🧠 Features

### 🔐 Authentication

* Email/password login (custom logic)
* Google authentication (Firebase)
* Guest login support
* Persistent login via localStorage

### 💳 Subscription System

* Free trial, Premium, and Premium Plus plans
* Plan selection flow
* Simulated Stripe-style checkout experience
* Form validation (card number, expiry, CVC)
* Conditional UI based on subscription level

### 📖 Book Experience

* Browse recommended and suggested books
* Dynamic book detail pages
* Audio playback with progress saving
* Read & Listen modes
* Save books to personal library

### 🎯 Smart UI Behavior

* Premium content gating
* Conditional rendering (premium badges, buttons, access)
* Responsive design down to mobile (~320px)
* Skeleton loaders for smooth UX
* Horizontal carousel with infinite scroll behavior

---

## 🛠 Tech Stack

* **Frontend:** Next.js (App Router), React
* **State Management:** Redux Toolkit
* **Authentication:** Firebase Auth
* **Styling:** CSS (custom, responsive design)
* **Icons:** React Icons
* **Deployment:** Vercel

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/markwaldron7string/Advanced-Virtual-Internship
cd Advanced-Virtual-Internship
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## 🧪 Test Payment Info

This project uses a **simulated Stripe checkout flow**.

Use the following test card:

```
Card Number: 4242 4242 4242 4242
Expiration: Any future date (e.g. 04/30)
CVC: Any 3 digits
```

More test cards:
https://docs.stripe.com/testing

---

## 📁 Project Structure

```
src/
  app/
    (app)/
      book/
      player/
      for-you/
    checkout/
  components/
  redux/
  services/
  hooks/
```

---

## ⚡ Key Highlights

* Built a full authentication + subscription flow from scratch
* Implemented conditional rendering based on user state
* Designed a Stripe-like checkout UI with validation
* Handled complex state transitions across pages
* Fully responsive layout with mobile-first adjustments

---

## 🎯 Future Improvements

* Real Stripe API integration
* Dark mode toggle for premium users
* User profile & settings page enhancements
* Backend database for persistent user data

---

## 🙌 Acknowledgements

* Inspired by the Summarist platform
* Stripe UI patterns for checkout design
* Firebase for authentication

---

## 📌 Author

**Mark Waldron**

---

## 💬 Final Note

This project represents a complete end-to-end user experience, including authentication, subscription logic, and responsive UI design. It reflects real-world frontend development challenges and solutions.
