import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 border-b border-black/10 dark:border-white/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between gap-4 sm:gap-6">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="AI Vehiql"
              width={160}
              height={40}
              priority
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 160px"
              className="h-8 sm:h-9 lg:h-10 w-auto transition-transform duration-200 group-hover:scale-105"
            />
          </Link>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 sm:h-10 px-4 sm:px-6 rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Link href="/sign-in" aria-label="Sign in">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
