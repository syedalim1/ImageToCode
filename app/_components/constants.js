import Constants from "@/data/Constants";
import { Award, Crown, Sparkles, Star } from "lucide-react";

// File: constants.js
export const testimonials = [
  {
    quote:
      "This tool has completely transformed our design-to-development workflow. We've cut our frontend development time by 70%!",
    author: "Sarah Johnson",
    role: "CTO",
    company: "TechFlow Inc.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
  },
  {
    quote:
      "As a solo developer, Img2Code feels like having an entire frontend team at my fingertips. The code quality is outstanding.",
    author: "Michael Chen",
    role: "Indie Developer",
    company: "PixelPerfect Apps",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 5,
  },
  {
    quote:
      "We've integrated Img2Code into our CI/CD pipeline and it's been a game-changer for our rapid prototyping process.",
    author: "Jessica Williams",
    role: "Lead Engineer",
    company: "Innovate Solutions",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 4,
  },
];

export const codeExample = `import React from 'react';

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">My App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;`;
