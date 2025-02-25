"use client";
import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

function Authentication() {
  return (
    <div>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <p>Please sign in to access this content.</p>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
    </div>
  );
}

export default Authentication;
