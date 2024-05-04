"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Whispr
        </a>
        
        {session ? (
          <>
          <div className="flex justify-center items-center gap-2">
          <Avatar>
              {/* <AvatarImage src={session? session?.user.image: "https://github.com/shadcn.png"} /> */}
              <AvatarImage
                src={session.user.image || "https://github.com/shadcn.png"}
                alt="User Avatar"
              />
              <AvatarFallback className="text-black text-sm font-extrabold uppercase">
                {session.user.username &&
                  session.user.username.trim().slice(0, 3)}
              </AvatarFallback>
            </Avatar>
            <span className="mr-4">Welcome, {user.username || user.email}</span>
          </div>
            
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/signin">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
