import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Book, CarFront, Heart, Layout } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const HeaderAdmin = async ({ isAdminPage = false }) => {
  const user = await checkUser();

  const isAdmin = user && user?.role === "ADMIN";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 border-b border-black/10 dark:border-white/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between gap-4 sm:gap-6">
          <Link href="/" className="relative flex items-center group">
            <Image
              src="/logo.png"
              alt="AI Vehiql"
              width={160}
              height={40}
              priority
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 160px"
              className="h-8 sm:h-9 lg:h-10 w-auto transition-transform duration-200 group-hover:scale-105"
            />
            {isAdminPage && (
              <small className="absolute top-0 -right-6 text-gray-400">
                admin
              </small>
            )}
          </Link>

          <div className="flex object-center gap-4 md:gap-6">
            {isAdminPage ? (
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft size={18} />
                  <span className="hidden md:inline">Back to App</span>
                </Button>
              </Link>
            ) : (
              <SignedIn>
                <div className="flex gap-2">
                  <Link href="/saved-cars">
                    <Button>
                      {" "}
                      <Heart />
                      <span className="hidden md:inline">Saved Cars</span>
                    </Button>
                  </Link>

                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline">
                        <Layout />
                        <span className="hidden md:inline">Admin Portal</span>
                      </Button>
                    </Link>
                  )}
                  {!isAdmin && (
                    <Link href="/reservations">
                      <Button variant="outline">
                        <CarFront />
                        <span className="hidden md:inline">
                          My Reservations
                        </span>
                      </Button>
                    </Link>
                  )}
                </div>
              </SignedIn>
            )}

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          <SignedOut>
            <Link href="/sign-in">
              <Button variant="outline">Login</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
