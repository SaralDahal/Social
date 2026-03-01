"use client";

import Link from "next/link";
import { posts, sampleComments } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { PostCard } from "@/components/post-card";
import { CommentSection } from "@/components/comment-section";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PostDetailContent({ id }) {
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-16">
          <p className="text-muted-foreground">Post not found.</p>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Feed
        </Link>

        <PostCard post={post} />

        <div className="mt-6">
          <CommentSection postId={post.id} comments={sampleComments} />
        </div>
      </main>
    </div>
  );
}
