import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Zia Bin Tahir — Backend Developer & DevOps Engineer",
  description:
    "Full-stack developer specialising in Node.js, Express, MySQL, Docker, and cloud deployments. Open to Backend, DevOps, and Technical Support roles.",
  keywords: [
    "Zia Bin Tahir", "Backend Developer", "DevOps Engineer", "Node.js", "Express.js",
    "MySQL", "Docker", "REST API", "Next.js", "Portfolio",
  ],
  authors: [{ name: "Zia Bin Tahir" }],
  openGraph: {
    title: "Zia Bin Tahir — Backend Developer & DevOps Engineer",
    description: "Production-grade portfolio showcasing backend, DevOps, and full-stack projects.",
    url: "https://ziaai.vercel.app",
    siteName: "Zia Bin Tahir Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zia Bin Tahir — Backend Developer",
    description: "Node.js | Express | MySQL | Docker | DevOps",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-dark-900 text-white antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f2937",
              color: "#f9fafb",
              border: "1px solid #374151",
              borderRadius: "8px",
            },
          }}
        />
      </body>
    </html>
  );
}
