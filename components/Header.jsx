"use client";

import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // 🔥 detect current route

  const isSignedIn = !!session;

  const hideAuthButtons =
    pathname === "/login" || pathname === "/register";

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Wealth Logo"
            width={200}
            height={60}
            className="h-12 w-auto"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {!isSignedIn && !hideAuthButtons && (
            <>
              <a href="#features" className="text-gray-600 hover:text-blue-600">
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-blue-600"
              >
                Testimonials
              </a>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>

              <Link href="/transaction/create">
                <Button className="flex items-center gap-2">
                  <PenBox size={18} />
                  <span className="hidden md:inline">
                    Add Transaction
                  </span>
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </>
          ) : (
            !hideAuthButtons && (
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            )
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;