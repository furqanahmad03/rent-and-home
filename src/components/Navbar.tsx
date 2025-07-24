"use client"

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Heart, User, LogOut, Eye, EyeOff, Mail, Lock, ChevronDown, LayoutDashboard, Settings } from "lucide-react";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"

import toast, { Toaster } from 'react-hot-toast';

const navLinks = [
  { label: "All Properties", href: "/houses" },
  { label: "Buy", href: "/houses?purpose=buy" },
  { label: "Rent", href: "/houses?purpose=rent" },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    const loadingToast = toast.loading('Signing you out...', {
      icon: '⏳',
    });
    
    // Small delay to show the loading state
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success('Successfully signed out!', {
        icon: '👋',
        duration: 2000,
      });
      signOut({ callbackUrl: '/' });
    }, 500);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isSignUp) {
      // Show loading toast for sign up
      const loadingToast = toast.loading('Creating your account...', {
        icon: '⏳',
      });
      
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        if (!response.ok) {
          toast.error(data.error || "Registration failed", {
            icon: '❌',
            duration: 4000,
          });
        } else {
          // Auto sign in after successful registration
          const signInToast = toast.loading('Signing you in automatically...', {
            icon: '⏳',
          });
          
          try {
            const { signIn } = await import('next-auth/react');
            const result = await signIn("credentials", {
              email,
              password,
              redirect: false,
            });
            
            toast.dismiss(signInToast);
            
            if (result?.error) {
              toast.error("Account created but sign in failed. Please try signing in manually.", {
                icon: '⚠️',
                duration: 4000,
              });
              setIsSignUp(false);
            } else {
              toast.success("Account created and signed in successfully!", {
                icon: '🎉',
                duration: 4000,
              });
              setOpen(false);
              setEmail("");
              setPassword("");
              setName("");
            }
          } catch (signInError) {
            toast.dismiss(signInToast);
            toast.error("Account created but sign in failed. Please try signing in manually.", {
              icon: '⚠️',
              duration: 4000,
            });
            setIsSignUp(false);
          }
        }
      } catch {
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        toast.error("An error occurred. Please try again.", {
          icon: '❌',
          duration: 4000,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Show loading toast for sign in
      const loadingToast = toast.loading('Signing you in...', {
        icon: '⏳',
      });
      
      try {
        const { signIn } = await import('next-auth/react');
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        if (result?.error) {
          toast.error("Invalid email or password", {
            icon: '❌',
            duration: 4000,
          });
        } else {
          toast.success("Successfully signed in!", {
            icon: '✅',
            duration: 3000,
          });
          setOpen(false);
          setEmail("");
          setPassword("");
          setName("");
        }
      } catch {
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        toast.error("An error occurred. Please try again.", {
          icon: '❌',
          duration: 4000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative z-50 max-w-7xl mx-auto">
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Rent&Home
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-black font-medium px-2 py-2 rounded-md transition-colors hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Authentication */}
            {!mounted || status === 'loading' ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0 bg-blue-600 border-blue-600 hover:bg-blue-700">
                    <User className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                        {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {session.user?.name || 'User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {session.user?.email}
            </span>
                      </div>
                            </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 w-full">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex items-center gap-2 w-full">
                      <Heart className="h-4 w-4" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} variant="destructive" className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                      {isSignUp ? "Create your account" : "Sign in to your account"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      {isSignUp
                        ? "Join Rent&Home to save your favorite properties."
                        : "Access your favorite properties."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <form onSubmit={handleAuth} className="space-y-6 mt-2">
                    {isSignUp && (
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          placeholder="Enter your email"
                        />
                      </div>
          </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete={isSignUp ? "new-password" : "current-password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          placeholder={isSignUp ? "Create a password" : "Enter your password"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading
                        ? isSignUp
                          ? "Creating account..."
                          : "Signing in..."
                        : isSignUp
                          ? "Create account"
                          : "Sign in"}
                    </Button>
                    <div className="text-center text-sm text-gray-600">
                      {isSignUp ? (
                        <>
                          Already have an account?{' '}
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-500 underline"
                            onClick={() => {
                              setIsSignUp(false);
                            }}
                          >
                            Sign in
                          </button>
                        </>
                      ) : (
                        <>
                          Don&apos;t have an account?{' '}
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-500 underline"
                            onClick={() => {
                              setIsSignUp(true);
                            }}
                          >
                            Sign up
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;