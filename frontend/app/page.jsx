import { Navbar } from "@/components/navbar";
import { FeedContent } from "@/components/feed-content";
import { TrendingSidebar } from "@/components/trending-sidebar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <FeedContent />
        <TrendingSidebar />
      </main>
    </div>
  );
}
