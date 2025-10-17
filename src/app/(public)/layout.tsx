import Footer from "@/components/layout/footer";
import LandingPageHeader from "@/components/layout/landing-page-header";
import { FirebaseClientProvider } from "@/firebase";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <LandingPageHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </FirebaseClientProvider>
  );
}
