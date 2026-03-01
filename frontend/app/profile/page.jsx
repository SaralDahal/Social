import { Navbar } from "@/components/navbar";
import { ProfileContent } from "@/components/profile-content";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <ProfileContent />
      </main>
    </div>
  );
}
