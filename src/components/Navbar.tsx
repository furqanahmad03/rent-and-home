"use client"

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Heart, User, LogOut, Eye, EyeOff, Mail, Lock, ChevronDown, LayoutDashboard, Settings, Globe, Menu, X, Home, Search } from "lucide-react";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useParams } from 'next/navigation';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const t = useTranslations('navbar');
  const { locale } = useParams();
  const authT = useTranslations('auth');
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "allProperties", href: `/${locale}/houses` },
    { label: "buy", href: `/${locale}/houses?purpose=buy` },
    { label: "rent", href: `/${locale}/houses?purpose=rent` },
  ];

  // Language switcher logic
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    const loadingToast = toast.loading(authT('signingOut'), {
      icon: '⏳',
    });
    
    // Small delay to show the loading state
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success(authT('signedOut'), {
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
      const loadingToast = toast.loading(authT('creatingAccountLoading'), {
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
          toast.error(data.error || authT('registrationFailed'), {
            icon: '❌',
            duration: 4000,
          });
        } else {
          // Auto sign in after successful registration
          const signInToast = toast.loading(authT('signingInAuto'), {
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
              toast.error(authT('signInFailed'), {
                icon: '⚠️',
                duration: 4000,
              });
              setIsSignUp(false);
            } else {
              toast.success(authT('accountCreated'), {
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
            toast.error(authT('signInFailed'), {
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
      const loadingToast = toast.loading(authT('signingInLoading'), {
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
          toast.error(authT('invalidCredentials'), {
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
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 px-4 z-[9999] overflow-y-scroll pb-5">
                <SheetHeader className='px-0 mx-0'>
                  <SheetTitle>{t('menu')}</SheetTitle>
                  <SheetDescription>
                    {t('menuDescription')}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6">
                  {/* Navigation Links */}
                  {session && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('navigation')}</h3>
                      {navLinks.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href as string}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                        >
                          {item.label === "allProperties" ? <Search className="h-4 w-4" /> :
                           item.label === "buy" ? <Home className="h-4 w-4" /> :
                           <Search className="h-4 w-4" />}
                          {t(item.label)}
                        </Link>
                      ))}
                    </div>
                  )}

                  <Separator />

                  {/* User Menu */}
                  {session ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('account')}</h3>
                      <Link
                        href={`/${locale}/dashboard`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t('dashboard')}
                      </Link>
                      <Link
                        href={`/${locale}/profile`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                      >
                        <User className="h-4 w-4" />
                        {t('profile')}
                      </Link>
                      <Link
                        href={`/${locale}/favorites`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        {t('favorites')}
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('signOut')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('account')}</h3>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setOpen(true);
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors w-full text-left"
                      >
                        <User className="h-4 w-4" />
                        {t('signIn')}
                      </button>
                    </div>
                  )}

                  <Separator />

                  {/* Language Switcher */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('language')}</h3>
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLanguageChange(language.code);
                        }}
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors w-full text-left ${
                          locale === language.code 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-accent'
                        }`}
                      >
                        <Globe className="h-4 w-4" />
                        {language.name}
                      </button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href={`/${locale}`} className="text-2xl font-bold text-blue-600">
            Rent&Home
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {session && navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href as string}
                className="text-black font-medium px-2 py-2 rounded-md transition-colors hover:text-blue-600"
              >
                {t(item.label)}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {languages.find(lang => lang.code === locale)?.name || 'English'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={locale === language.code ? 'bg-accent' : ''}
                  >
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Authentication */}
            {!mounted || status === 'loading' ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className='hidden md:block'>
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
                    <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 w-full">
                      <LayoutDashboard className="h-4 w-4" />
                      {t('dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/profile`} className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/favorites`} className="flex items-center gap-2 w-full">
                      <Heart className="h-4 w-4" />
                      {t('favorites')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} variant="destructive" className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {t('signIn')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                      {isSignUp ? authT('createAccount') : authT('signInAccount')}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      {isSignUp
                        ? authT('joinDescription')
                        : authT('accessDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <form onSubmit={handleAuth} className="space-y-6 mt-2">
                    {isSignUp && (
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          {authT('fullName')}
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
                            placeholder={authT('enterFullName')}
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {authT('emailAddress')}
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
                          placeholder={authT('enterEmail')}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        {authT('password')}
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
                          placeholder={isSignUp ? authT('createPassword') : authT('enterPassword')}
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
                          ? authT('creatingAccount')
                          : authT('signingIn')
                        : isSignUp
                          ? authT('createAccountButton')
                          : t('signIn')}
                    </Button>
                    <div className="text-center text-sm text-gray-600">
                      {isSignUp ? (
                        <>
                          {authT('alreadyHaveAccount')}{' '}
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-500 underline"
                            onClick={() => {
                              setIsSignUp(false);
                            }}
                          >
                            {t('signIn')}
                          </button>
                        </>
                      ) : (
                        <>
                          {authT('dontHaveAccount')}{' '}
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-500 underline"
                            onClick={() => {
                              setIsSignUp(true);
                            }}
                          >
                            {authT('signUp')}
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