"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles = {
  open: "bg-warning/10 text-warning-foreground border-warning/20",
  "in-progress": "bg-primary/10 text-primary border-primary/20",
  resolved: "bg-success/10 text-success border-success/20",
};

const statusLabels = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
};

export function ComplaintCard({ complaint }) {
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(complaint.upvotes);

  const initials = complaint.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleUpvote = () => {
    if (upvoted) {
      setUpvoted(false);
      setUpvoteCount((c) => c - 1);
    } else {
      setUpvoted(true);
      setUpvoteCount((c) => c + 1);
    }
  };

  return (
    <article className="flex gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80">
      {/* Upvote column */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9",
            upvoted ? "text-primary" : "text-muted-foreground"
          )}
          onClick={handleUpvote}
        >
          <ArrowUp className={cn("h-4 w-4", upvoted && "fill-current")} />
          <span className="sr-only">Upvote</span>
        </Button>
        <span
          className={cn(
            "text-sm font-semibold",
            upvoted ? "text-primary" : "text-muted-foreground"
          )}
        >
          {upvoteCount}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              {complaint.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {complaint.description}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn("shrink-0 text-xs", statusStyles[complaint.status])}
          >
            {statusLabels[complaint.status]}
          </Badge>
        </div>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-muted text-[8px] font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span>{complaint.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {complaint.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {complaint.createdAt}
          </div>
          <Badge variant="secondary" className="text-xs">
            {complaint.category}
          </Badge>
        </div>
      </div>
    </article>
  );
}
