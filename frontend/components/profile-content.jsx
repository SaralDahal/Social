"use client";

import { useState, useEffect } from "react";
import { PostCard } from "@/components/post-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  MapPin,
  Calendar,
  LinkIcon,
  Edit3,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { postsApi } from "@/lib/api";

export function ProfileContent() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const data = await postsApi.getAll();
        const userPosts = Array.isArray(data) 
          ? data.filter(p => p.author?._id === user?._id)
          : (data.posts || []).filter(p => p.author?._id === user?._id);
        setPosts(userPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserPosts();
    }
  }, [user?._id]);

  if (!user) {
    return <div className="py-12 text-center text-muted-foreground">Loading profile...</div>;
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      {/* Profile header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <Avatar className="h-20 w-20 shrink-0">
            <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {user.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  @{user.name.toLowerCase().replace(/\s+/g, "")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-foreground">
              Civic activist raising awareness about community issues.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {user.locality}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-6">
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">
                  {posts.length}
                </p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">
                  0
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">
                  0
                </p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none px-0">
          <TabsTrigger
            value="posts"
            className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="complaints"
            className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Complaints
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4 flex flex-col gap-3">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading posts...
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id || post.id} post={post} />)
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No posts yet. Share your first issue to get started.
            </div>
          )}
        </TabsContent>

        <TabsContent value="complaints" className="mt-4">
          <div className="py-12 text-center text-sm text-muted-foreground">
            No complaints filed yet.
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          <div className="py-12 text-center text-sm text-muted-foreground">
            No saved posts yet. Bookmark posts to see them here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
