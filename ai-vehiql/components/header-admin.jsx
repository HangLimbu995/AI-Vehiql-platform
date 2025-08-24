import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, CarFront, Heart, Layout, MoreHorizontal } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const HeaderAdmin = async ({ isAdminPage = false }) => {
  const user = await checkUser();
  const isAdmin = user && user?.role === "ADMIN";

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 border-b border-black/10 dark:border-white/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-14 sm:h-16 lg:h-20">
          {/* Left: logo + optional admin badge */}
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="relative flex items-center shrink-0">
              <Image
                src="/logo.png"
                alt="AI Vehiql"
                width={160}
                height={40}
                priority
                sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 160px"
                className="h-7 sm:h-9 lg:h-10 w-auto transition-transform duration-200 group-hover:scale-105"
              />
              {isAdminPage && (
                <span className="ml-2 inline-flex items-center rounded-md bg-slate-100 text-xs text-slate-700 px-2 py-0.5 hidden sm:inline">
                  admin
                </span>
              )}
            </Link>

            {/* Back button shown on md+ to return to app */}
            {isAdminPage && (
              <div className="hidden md:flex items-center">
                <Link href="/" className="ml-2">
                  <Button variant="ghost" size="sm" className="h-9">
                    <ArrowLeft size={16} />
                    <span className="hidden md:inline ml-2">Back to App</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-2">
              <SignedIn>
                <Link href="/saved-cars">
                  <Button variant="ghost" size="sm" className="h-9">
                    <Heart size={16} />
                    <span className="hidden md:inline ml-2">Saved Cars</span>
                  </Button>
                </Link>

                {isAdmin ? (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="h-9">
                      <Layout size={16} />
                      <span className="hidden md:inline ml-2">Admin Portal</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/reservations">
                    <Button variant="outline" size="sm" className="h-9">
                      <CarFront size={16} />
                      <span className="hidden md:inline ml-2">My Reservations</span>
                    </Button>
                  </Link>
                )}
              </SignedIn>
            </div>

            {/* User / Auth */}
            <div className="flex items-center gap-2">
              <SignedIn>
                <div className="flex items-center gap-2">
                  {/* On small screens we only show the UserButton icon; details menu holds other actions */}
                  <UserButton />
                </div>
              </SignedIn>

              <SignedOut>
                <Link href="/sign-in">
                  <Button variant="outline" size="sm" className="h-9">
                    Login
                  </Button>
                </Link>
              </SignedOut>
            </div>

            {/* Mobile: condensed overflow menu (no JS) */}
            <div className="sm:hidden">
              <details className="relative">
                <summary
                  className="flex items-center justify-center h-9 w-9 rounded-md bg-white/90 border border-slate-100 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  aria-label="Open menu"
                >
                  <MoreHorizontal size={18} />
                </summary>

                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-slate-100 shadow-lg p-2 z-50">
                  <nav className="flex flex-col gap-1">
                    <SignedIn>
                      <Link href="/saved-cars" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-50">
                        <Heart size={16} />
                        <span>Saved Cars</span>
                      </Link>

                      {isAdmin ? (
                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-50">
                          <Layout size={16} />
                          <span>Admin Portal</span>
                        </Link>
                      ) : (
                        <Link href="/reservations" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-50">
                          <CarFront size={16} />
                          <span>My Reservations</span>
                        </Link>
                      )}
                    </SignedIn>

                    <SignedOut>
                      <Link href="/sign-in" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-50">
                        <span>Login</span>
                      </Link>
                    </SignedOut>

                    <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-50">
                      <span>Home</span>
                    </Link>
                  </nav>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
