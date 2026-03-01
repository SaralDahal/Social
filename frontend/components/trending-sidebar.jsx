"use client";

import { trendingTopics, categories } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Hash } from "lucide-react";

export function TrendingSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-20 flex flex-col gap-6">
        {/* Trending */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trending
          </div>
          <ul className="flex flex-col gap-2.5">
            {trendingTopics.map((topic) => (
              <li
                key={topic.tag}
                className="group flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-1.5 text-sm text-foreground group-hover:text-primary">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  {topic.tag}
                </span>
                <span className="text-xs text-muted-foreground">
                  {topic.posts} posts
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.slice(1).map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="cursor-pointer text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="px-2 text-xs text-muted-foreground">
          Awaaz - Raise Your Voice for Change.
        </p>
      </div>
    </aside>
  );
}
