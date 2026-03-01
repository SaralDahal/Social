"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, Send, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const categories = [
  "Health",
  "Education",
  "Infrastructure",
  "Environment",
  "Safety",
  "Sanitation",
  "Water",
  "Electricity",
  "Transportation",
  "Other",
];

export function CreatePost({ onSubmit }) {
  const { user } = useAuth();
  const titleInputRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [locality, setLocality] = useState(user?.locality || "");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Focus title input when form expands
  useEffect(() => {
    if (isExpanded && titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isExpanded]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category || !locality.trim()) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("locality", locality);
      if (address) formData.append("address", address);
      
      images.forEach((img) => {
        formData.append("images", img);
      });

      await onSubmit(formData);
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setLocality(user?.locality || "");
      setAddress("");
      setImages([]);
      setIsExpanded(false);
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setLocality(user?.locality || "");
    setAddress("");
    setImages([]);
    setIsExpanded(false);
  };

  const userInitials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className={`rounded-lg border border-border bg-card transition-all duration-300 ${isExpanded ? "p-4" : "p-3"}`}>
      {/* Collapsed state */}
      {!isExpanded && (
        <div className="flex gap-3 items-start">
          <Avatar className="h-10 w-10 shrink-0 mt-2">
            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex flex-col gap-2">
            <Textarea
              placeholder="Share a social issue or raise awareness..."
              onFocus={() => setIsExpanded(true)}
              className="min-h-[72px] resize-none border-muted bg-muted text-sm text-muted-foreground placeholder:text-muted-foreground focus:bg-card transition-colors"
              
            />

           
          </div>
        </div>
      )}

      {/* Expanded state */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
          {/* Header with avatar */}
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-xs">{user?.locality}</p>
            </div>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-3">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title" className="text-xs font-medium">
                Title *
              </Label>
              <Input
                ref={titleInputRef}
                id="title"
                placeholder="Summary of the issue (max 200 chars)"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 200))}
                className="text-sm"
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {title.length}/200
              </p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description" className="text-xs font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail (max 2000 chars)"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                className="min-h-[100px] resize-none text-sm"
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/2000
              </p>
            </div>

            {/* Category and Locality */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category" className="text-xs font-medium">
                  Category *
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="locality" className="text-xs font-medium">
                  Locality *
                </Label>
                <Input
                  id="locality"
                  placeholder="Area/Colony"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="text-sm h-9"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address" className="text-xs font-medium">
                Full Address (optional)
              </Label>
              <Input
                id="address"
                placeholder="Complete address/landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="text-sm h-9"
              />
            </div>

            {/* Images */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">
                Images (max 5)
              </Label>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-16 w-16 rounded border border-border bg-muted overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${idx}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center gap-2 rounded border border-dashed border-border bg-muted/30 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors">
                <ImagePlus className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {images.length === 0 ? "Add images" : `${images.length} image(s) selected`}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={images.length >= 5}
                />
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 justify-end pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !description.trim() || !category || !locality.trim() || loading}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
