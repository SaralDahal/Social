"use client";

import { useState } from "react";
import { complaints, categories } from "@/lib/mock-data";
import { ComplaintCard } from "@/components/complaint-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const statusFilters = ["All", "Open", "In Progress", "Resolved"];

export function ComplaintsContent() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered =
    statusFilter === "All"
      ? complaints
      : complaints.filter(
          (c) =>
            (statusFilter === "Open" && c.status === "open") ||
            (statusFilter === "In Progress" && c.status === "in-progress") ||
            (statusFilter === "Resolved" && c.status === "resolved")
        );

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Complaints
          </h1>
          <p className="text-sm text-muted-foreground">
            File and track civic complaints in your community.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 self-start">
              <Plus className="h-4 w-4" />
              File Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>File a Complaint</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title" className="text-sm">
                  Title
                </Label>
                <Input id="title" placeholder="Brief title of the issue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="desc" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="desc"
                  placeholder="Describe the issue in detail..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="location" className="text-sm">
                    Location
                  </Label>
                  <Input id="location" placeholder="Area, Sector" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm">Submit Complaint</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {statusFilters.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-7 text-xs",
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </Button>
        ))}
      </div>

      {/* Complaint list */}
      <div className="flex flex-col gap-3">
        {filtered.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No complaints found with this filter.
          </div>
        )}
      </div>
    </div>
  );
}
