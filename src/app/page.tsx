import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import Statistics from "@/components/Statistics";
import Reviews from "@/components/Reviews";
import Numbers from "@/components/Numbers";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="home-page">
      <Nav />

      <main className="home-main">
        <Hero />
        <Highlights />
        <Statistics />
        <Reviews />
        <Numbers />
      </main>

      <Footer />
    </div>
  );
}