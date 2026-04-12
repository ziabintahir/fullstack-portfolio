import { AuthProvider } from "@/lib/auth";

export const metadata = {
  title: "Admin Dashboard — Zia Portfolio",
  robots: { index: false, follow: false }, // hide admin from search engines
};

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark-900">{children}</div>
    </AuthProvider>
  );
}
