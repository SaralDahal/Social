"use client";

import { useState, useEffect } from "react";
import { categories } from "@/lib/mock-data";
import { PostCard } from "@/components/post-card";
import { CreatePost } from "@/components/create-post";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { postsApi } from "@/lib/api";

export function FeedContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const handleCreatePostSubmit = async (formData) => {
    try {
      await postsApi.create(formData);
      // Refresh posts after creating a new one
      const data = await postsApi.getAll(activeCategory === "All" ? null : activeCategory);
      setPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postsApi.getAll(activeCategory === "All" ? null : activeCategory);
        setPosts(Array.isArray(data) ? data : data.posts || []);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory]);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      {/* Category filter row */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.slice(0, 7).map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 shrink-0 text-xs",
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Create Post */}
      <CreatePost onSubmit={handleCreatePostSubmit} />

      {/* Posts */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No posts in this category yet. Be the first to raise awareness.
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id || post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
