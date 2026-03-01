"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function AuthForm({ mode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (isLogin) {
        const res = await authApi.login({
          email: formData.get("email"),
          password: formData.get("password"),
        });
        login(res); // Cookie is set by backend, just pass user data
      } else {
        const res = await authApi.signup({
          name: formData.get("name"),
          email: formData.get("email"),
          locality: formData.get("locality") || "Not specified",
          password: formData.get("password"),
        });
        login(res); // Cookie is set by backend, just pass user data
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel - branding */}
      <div className="hidden flex-1 flex-col justify-between bg-primary p-10 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/20">
            <Megaphone className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-primary-foreground">
            Awaaz
          </span>
        </Link>

        <div className="max-w-sm">
          <h2 className="text-3xl font-bold leading-tight text-primary-foreground text-balance">
            Every voice matters. Every issue counts.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
            Join a community of citizens raising awareness on social problems,
            filing complaints, and driving real change in their communities.
          </p>
        </div>

        <p className="text-xs text-primary-foreground/50">
          Awaaz - Raise Your Voice for Change
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Megaphone className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Awaaz</span>
          </div>

          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to feed
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isLogin
              ? "Sign in to continue raising your voice."
              : "Join the community and start making a difference."}
          </p>

          {error && (
            <div className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-sm">
                  Full Name
                </Label>
                <Input id="name" name="name" placeholder="Your full name" required />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="locality" className="text-sm">
                  Locality
                </Label>
                <Input
                  id="locality"
                  name="locality"
                  placeholder="Your city/area"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs text-primary transition-colors hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button className="mt-2 w-full" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              href={isLogin ? "/signup" : "/login"}
              className="font-medium text-primary transition-colors hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
