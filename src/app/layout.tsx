import "./globals.css";
import Providers from "./providers";
import AuthModal from "@/components/AuthModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthModal />
          {children}
        </Providers>
      </body>
    </html>
  );
}