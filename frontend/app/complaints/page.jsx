import { Navbar } from "@/components/navbar";
import { ComplaintsContent } from "@/components/complaints-content";

export default function ComplaintsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <ComplaintsContent />
      </main>
    </div>
  );
}
