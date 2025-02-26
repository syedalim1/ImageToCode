"use client";
import React, { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

function Authentication() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <SignedIn>
        {isClient ? <UserButton /> : null}
      </SignedIn>
      <SignedOut>
        <div className="flex gap-5">
          <div className="bg-blue-500 text-white rounded-xl p-4 text-bold">
            <SignInButton />
          </div>
          <div className="bg-blue-500 text-white rounded-xl p-4 text-bold">
            <SignUpButton />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

export default Authentication;
