"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked ?? false);
  const [disliked, setDisliked] = useState(post.disliked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [dislikeCount, setDislikeCount] = useState(post.dislikes);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      if (disliked) {
        setDisliked(false);
        setDislikeCount((c) => c - 1);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setDislikeCount((c) => c - 1);
    } else {
      setDisliked(true);
      setDislikeCount((c) => c + 1);
      if (liked) {
        setLiked(false);
        setLikeCount((c) => c - 1);
      }
    }
  };

  const initials = post?.user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <article className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {post?.user?.name}
              </span>
             
            </div>
            <span className="text-xs text-muted-foreground">
              {post?.createdAt}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Badge
            variant="secondary"
            className="hidden text-xs sm:inline-flex"
          >
            {post?.category}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem>{"Follow @" + post?.user?.username}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category badge for mobile */}
      <Badge variant="secondary" className="mt-2 text-xs sm:hidden">
        {post?.category}
      </Badge>

      {/* Content */}
      <p className="mt-3 text-sm leading-relaxed text-foreground">
        {post?.description}
      </p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1.5 px-2.5 text-xs text-muted-foreground",
            liked && "text-primary"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className={cn("h-3.5 w-3.5", liked && "fill-current")} />
          {likeCount}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1.5 px-2.5 text-xs text-muted-foreground",
            disliked && "text-destructive"
          )}
          onClick={handleDislike}
        >
          <ThumbsDown
            className={cn("h-3.5 w-3.5", disliked && "fill-current")}
          />
          {dislikeCount}
        </Button>

        <Link href={`/post/${post?._id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {post?.comments}
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground"
        >
          <Share2 className="h-3.5 w-3.5" />
          {post?.shares}
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-muted-foreground",
            saved && "text-primary"
          )}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
          <span className="sr-only">Save post</span>
        </Button>
      </div>
    </article>
  );
}
