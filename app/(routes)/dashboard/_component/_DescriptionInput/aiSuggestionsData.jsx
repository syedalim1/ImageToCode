import React from "react";
import {
  Layout,
  Monitor,
  Smartphone,
  Layers,
  BookOpen,
  Palette,
  Zap,
  Share2,
} from "lucide-react";
;

export const aiSuggestions = [
  {
    id: "landing",
    category: "Landing Pages",
    icon: <Layout className="w-4 h-4" />,
    content:
      "Create a modern landing page with a hero section featuring a gradient background, animated call-to-action buttons, and a features grid with hover effects. Include a sticky header with smooth scroll navigation and a testimonials carousel.",
  },
  {
    id: "dashboard",
    category: "Dashboards",
    icon: <Monitor className="w-4 h-4" />,
    content:
      "Design a dashboard interface with analytics charts, user statistics cards, and a sidebar navigation with smooth transitions. Add a notification center, quick actions panel, and customizable widgets with drag-and-drop functionality.",
  },
  {
    id: "mobile",
    category: "Mobile Apps",
    icon: <Smartphone className="w-4 h-4" />,
    content:
      "Build a mobile app UI with bottom navigation, swipeable cards, and a dark mode toggle feature. Include pull-to-refresh animations, skeleton loading states, and haptic feedback for interactive elements.",
  },
  {
    id: "ecommerce",
    category: "E-commerce",
    icon: <Layers className="w-4 h-4" />,
    content:
      "Develop an e-commerce product page with image gallery, size selector, add to cart animation, and related products carousel. Include a sticky product summary on scroll, inventory status indicator, and size guide modal.",
  },
  {
    id: "blog",
    category: "Blogs",
    icon: <BookOpen className="w-4 h-4" />,
    content:
      "Create a blog layout with featured post hero, category filtering, newsletter subscription form, and author profiles. Add reading time estimates, table of contents for long articles, and social sharing buttons with share counts.",
  },
  {
    id: "portfolio",
    category: "Portfolios",
    icon: <Palette className="w-4 h-4" />,
    content:
      "Design a creative portfolio with project showcases, animated transitions between sections, and a contact form with validation. Include a skills progress visualization, downloadable resume, and testimonials from clients.",
  },
  {
    id: "saas",
    category: "SaaS Products",
    icon: <Zap className="w-4 h-4" />,
    content:
      "Build a SaaS product homepage with feature highlights, pricing comparison table, and customer testimonials. Include an interactive product demo, FAQ accordion, and a sticky call-to-action bar with trial signup form.",
  },
  {
    id: "social",
    category: "Social Media",
    icon: <Share2 className="w-4 h-4" />,
    content:
      "Create a social media feed interface with infinite scroll, interactive post cards, and a stories carousel. Add comment threads with nested replies, reaction animations, and a floating compose button.",
  },
];

// Tag suggestions organized by categories
export const tagSuggestions = {
  "Page Types": [
    "Landing Page",
    "Dashboard",
    "Portfolio",
    "Blog",
    "E-commerce",
  ],
  Components: [
    "Hero Section",
    "Navigation",
    "Footer",
    "Contact Form",
    "Gallery",
  ],
  Styles: [
    "Minimalist",
    "Colorful",
    "Dark Mode",
    "Glassmorphism",
    "Neumorphism",
  ],
  Features: [
    "Responsive",
    "Animated",
    "Interactive",
    "Accessible",
    "Mobile-First",
  ],
};
