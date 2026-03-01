"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";

function CommentItem({ comment }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const initials = comment.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card p-3">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarFallback className="bg-muted text-[10px] font-medium text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            {comment.author.name}
          </span>
          <span className="text-xs text-muted-foreground">
            @{comment.author.username}
          </span>
          <span className="text-xs text-muted-foreground">
            {comment.createdAt}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-foreground">
          {comment.content}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "mt-1 h-6 gap-1 px-2 text-xs text-muted-foreground",
            liked && "text-primary"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className={cn("h-3 w-3", liked && "fill-current")} />
          {likeCount}
        </Button>
      </div>
    </div>
  );
}

export function CommentSection({ postId, comments }) {
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(comments);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: String(Date.now()),
      author: {
        id: "1",
        name: "You",
        username: "you",
        avatar: "",
        bio: "",
        followers: 0,
        following: 0,
        postsCount: 0,
      },
      content: newComment,
      createdAt: "Just now",
      likes: 0,
    };
    setCommentList([comment, ...commentList]);
    setNewComment("");
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-foreground">
        {"Comments (" + commentList.length + ")"}
      </h2>

      {/* Write comment */}
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
            U
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] resize-none text-sm"
          />
          <Button
            size="sm"
            className="h-7 gap-1.5 self-end px-3 text-xs"
            disabled={!newComment.trim()}
            onClick={handleSubmit}
          >
            <Send className="h-3 w-3" />
            Comment
          </Button>
        </div>
      </div>

      {/* Comment list */}
      <div className="flex flex-col gap-3">
        {commentList.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
