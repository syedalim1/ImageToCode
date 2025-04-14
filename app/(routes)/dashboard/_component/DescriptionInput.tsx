"use client";

import { IsUploadingContext } from "@/app/context/IsUploadingContext";
import { UserDescriptionContext } from "@/app/context/UserDescriptionContext";
import { ProjectTitleContext } from "@/app/context/ProjectTitleContext";
import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Sparkles,
  Save,
  Copy,
  Trash2,
  Wand2,
  Clock,
  Plus,
  Check,
  Info,
  AlertCircle,
  Tag,
  Lightbulb,
  Star,
  Heart,
  BookOpen,
  Bookmark,
  Zap,
  Palette,
  Layout,
  Monitor,
  Smartphone,
  Layers,
  RefreshCw,
  Download,
  Share2
} from "lucide-react";

// Enhanced animated background elements
const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 8 + 3,
            height: Math.random() * 8 + 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(
              Math.random() * 100
            ) + 100}, ${Math.floor(Math.random() * 200) + 55}, 0.3)`,
          }}
          animate={{
            x: [0, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 40 - 20, 0],
            scale: [1, Math.random() * 0.5 + 1, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 8 + 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Gradient orbs */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-purple-300 to-indigo-300 opacity-20 blur-3xl"></div>
      <div className="absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 opacity-20 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-0 w-40 h-40 rounded-full bg-gradient-to-tr from-blue-300 to-teal-300 opacity-10 blur-2xl"></div>

      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

// Animated success checkmark component
const SuccessCheckmark = ({ onComplete }: { onComplete: () => void }) => {
  const pathLength = 1;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl p-8 shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <motion.path
              d="M10 20L17 27L30 13"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onAnimationComplete={() => {
                setTimeout(onComplete, 1000);
              }}
            />
          </svg>
        </motion.div>
        <motion.p
          className="mt-4 text-center text-gray-700 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Saved successfully!
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Type definitions for enhanced features
interface Template {
  id: string;
  content: string;
  title: string;
  createdAt: number;
  category?: string;
}

interface AiSuggestion {
  id: string;
  content: string;
  category: string;
  icon: React.ReactNode;
}

const DescriptionInput = () => {
  const { userDescription, setUserDescription } = useContext(UserDescriptionContext);
  const { isUploading, setIsUploading } = useContext(IsUploadingContext);
  const { projectTitle } = useContext(ProjectTitleContext);

  // Enhanced state management
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(true);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [showSavedSuccess, setShowSavedSuccess] = useState(false);
  const [characterLimit] = useState(1500);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'suggestions' | 'templates'>('suggestions');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const controls = useAnimation();

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Enhanced AI suggestions with categories and icons
  const aiSuggestions: AiSuggestion[] = [
    {
      id: "landing",
      category: "Landing Pages",
      icon: <Layout className="w-4 h-4" />,
      content: "Create a modern landing page with a hero section featuring a gradient background, animated call-to-action buttons, and a features grid with hover effects. Include a sticky header with smooth scroll navigation and a testimonials carousel."
    },
    {
      id: "dashboard",
      category: "Dashboards",
      icon: <Monitor className="w-4 h-4" />,
      content: "Design a dashboard interface with analytics charts, user statistics cards, and a sidebar navigation with smooth transitions. Add a notification center, quick actions panel, and customizable widgets with drag-and-drop functionality."
    },
    {
      id: "mobile",
      category: "Mobile Apps",
      icon: <Smartphone className="w-4 h-4" />,
      content: "Build a mobile app UI with bottom navigation, swipeable cards, and a dark mode toggle feature. Include pull-to-refresh animations, skeleton loading states, and haptic feedback for interactive elements."
    },
    {
      id: "ecommerce",
      category: "E-commerce",
      icon: <Layers className="w-4 h-4" />,
      content: "Develop an e-commerce product page with image gallery, size selector, add to cart animation, and related products carousel. Include a sticky product summary on scroll, inventory status indicator, and size guide modal."
    },
    {
      id: "blog",
      category: "Blogs",
      icon: <BookOpen className="w-4 h-4" />,
      content: "Create a blog layout with featured post hero, category filtering, newsletter subscription form, and author profiles. Add reading time estimates, table of contents for long articles, and social sharing buttons with share counts."
    },
    {
      id: "portfolio",
      category: "Portfolios",
      icon: <Palette className="w-4 h-4" />,
      content: "Design a creative portfolio with project showcases, animated transitions between sections, and a contact form with validation. Include a skills progress visualization, downloadable resume, and testimonials from clients."
    },
    {
      id: "saas",
      category: "SaaS Products",
      icon: <Zap className="w-4 h-4" />,
      content: "Build a SaaS product homepage with feature highlights, pricing comparison table, and customer testimonials. Include an interactive product demo, FAQ accordion, and a sticky call-to-action bar with trial signup form."
    },
    {
      id: "social",
      category: "Social Media",
      icon: <Share2 className="w-4 h-4" />,
      content: "Create a social media feed interface with infinite scroll, interactive post cards, and a stories carousel. Add comment threads with nested replies, reaction animations, and a floating compose button."
    }
  ];

  // Group suggestions by category
  const suggestionsByCategory = aiSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, AiSuggestion[]>);

  // Load saved templates from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('descriptionTemplates');
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);

        // Handle both old format (string[]) and new format (Template[])
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && typeof parsed[0] === 'string') {
            // Convert old format to new format
            const converted = parsed.map((content, index) => ({
              id: `template-${index}`,
              content,
              title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
              createdAt: Date.now() - (index * 1000 * 60 * 60) // Fake timestamps
            }));
            setSavedTemplates(converted);
          } else {
            setSavedTemplates(parsed);
          }
        }
      } catch (e) {
        console.error('Error parsing saved templates:', e);
        setSavedTemplates([]);
      }
    }
  }, []);

  // Save template function with enhanced features
  const saveTemplate = () => {
    if (userDescription.trim()) {
      // Check if template with same content already exists
      const exists = savedTemplates.some(template => template.content === userDescription);

      if (!exists) {
        // Generate a title from the content or use project title if available
        const title = projectTitle || userDescription.substring(0, 30) + (userDescription.length > 30 ? '...' : '');

        const newTemplate: Template = {
          id: `template-${Date.now()}`,
          content: userDescription,
          title,
          createdAt: Date.now(),
          category: selectedCategory || 'General'
        };

        const newTemplates = [newTemplate, ...savedTemplates];
        setSavedTemplates(newTemplates);
        localStorage.setItem('descriptionTemplates', JSON.stringify(newTemplates));

        // Show success animation
        setShowSavedSuccess(true);

        // Animate the textarea
        controls.start({
          scale: [1, 1.02, 1],
          borderColor: ['rgba(99, 102, 241, 0.4)', 'rgba(16, 185, 129, 0.7)', 'rgba(99, 102, 241, 0.4)'],
          transition: { duration: 0.5 }
        });
      }
    }
  };

  // Delete template function
  const deleteTemplate = (id: string) => {
    const newTemplates = savedTemplates.filter(template => template.id !== id);
    setSavedTemplates(newTemplates);
    localStorage.setItem('descriptionTemplates', JSON.stringify(newTemplates));
  };

  // Copy to clipboard function with enhanced feedback
  const copyToClipboard = () => {
    navigator.clipboard.writeText(userDescription);
    setCopiedToClipboard(true);

    // Animate the textarea
    controls.start({
      scale: [1, 1.02, 1],
      borderColor: ['rgba(99, 102, 241, 0.4)', 'rgba(16, 185, 129, 0.7)', 'rgba(99, 102, 241, 0.4)'],
      transition: { duration: 0.5 }
    });

    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  // Get AI suggestion with category filtering
  const getAiSuggestion = (categoryFilter?: string) => {
    setIsGeneratingSuggestion(true);

    // Filter suggestions by category if provided
    const filteredSuggestions = categoryFilter
      ? aiSuggestions.filter(s => s.category === categoryFilter)
      : aiSuggestions;

    // Simulate AI suggestion generation
    setTimeout(() => {
      const randomSuggestion = filteredSuggestions[
        Math.floor(Math.random() * filteredSuggestions.length)
      ];
      setUserDescription(randomSuggestion.content);
      setIsGeneratingSuggestion(false);
      setShowAiSuggestions(false);
    }, 1500);
  };

  // Export description as a file
  const exportDescription = (format: 'txt' | 'md' | 'json') => {
    let content = userDescription;
    let mimeType = 'text/plain';
    let extension = 'txt';

    if (format === 'md') {
      content = `# ${projectTitle || 'Design Description'}\n\n${userDescription}`;
      mimeType = 'text/markdown';
      extension = 'md';
    } else if (format === 'json') {
      content = JSON.stringify({
        title: projectTitle || 'Design Description',
        description: userDescription,
        timestamp: new Date().toISOString()
      }, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-description.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportOptions(false);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Filter templates by search query
  const filteredTemplates = searchQuery
    ? savedTemplates.filter(template =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : savedTemplates;

  // Enhanced tag suggestions with categories
  const tagSuggestions = {
    "Page Types": ["Landing Page", "Dashboard", "Portfolio", "Blog", "E-commerce"],
    "Components": ["Hero Section", "Navigation", "Footer", "Contact Form", "Gallery"],
    "Styles": ["Minimalist", "Colorful", "Dark Mode", "Glassmorphism", "Neumorphism"],
    "Features": ["Responsive", "Animated", "Interactive", "Accessible", "Mobile-First"]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-6 shadow-xl border border-purple-200 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-indigo-300 opacity-20 blur-xl"></div>
      <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 opacity-20 blur-xl"></div>
      <BackgroundElements />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <div className="flex justify-between items-start mb-4">
          <motion.h2
            className="text-2xl font-bold text-indigo-800 flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="mr-3 p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg"
              whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            Describe Your Design
          </motion.h2>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white rounded-lg shadow-md text-indigo-600 hover:bg-indigo-50 transition-all duration-300 flex items-center"
              onClick={() => setShowTemplates(!showTemplates)}
              title="Saved templates"
            >
              <Clock className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white rounded-lg shadow-md text-indigo-600 hover:bg-indigo-50 transition-all duration-300 flex items-center"
              onClick={() => setShowAiSuggestions(!showAiSuggestions)}
              title="AI suggestions"
            >
              <Wand2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <motion.p
          className="text-indigo-600 mb-6 pl-8 text-sm md:text-base"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          Add details to help the AI understand your design better
          <motion.span
            className="inline-block ml-1"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >✨</motion.span>
        </motion.p>

        <div className="relative">
          <textarea
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
            placeholder="Describe what you want to generate... (e.g., 'A responsive landing page with a hero section, features grid, and contact form')"
            className={`w-full h-48 p-5 border-2 border-indigo-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-inner text-gray-700 transition-all duration-300 ${isUploading ? "bg-gray-100 opacity-70" : ""
              }`}
            disabled={isUploading}
          />



          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white bg-opacity-70 backdrop-blur-sm">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-indigo-400 opacity-20"></div>
                <svg
                  className="animate-spin h-10 w-10 text-indigo-600 relative z-10"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Saved templates panel */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-white p-3 rounded-lg shadow-md border border-indigo-100">
                <h3 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> Saved Templates
                </h3>
                {savedTemplates.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto">
                    {savedTemplates.map((template, index) => (
                      <motion.div
                        key={index}
                        className="flex justify-between items-center p-2 hover:bg-indigo-50 rounded-md mb-1 group"
                        whileHover={{ x: 5 }}
                      >
                        <button
                          className="text-left text-xs text-gray-700 truncate flex-1"
                          onClick={() => setUserDescription(template.content)}
                        >
                          {template.title}
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No saved templates yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Suggestions panel */}
        <AnimatePresence>
          {showAiSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-white p-3 rounded-lg shadow-md border border-indigo-100">
                <h3 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                  <Wand2 className="w-4 h-4 mr-1" /> AI Suggestions
                </h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => getAiSuggestion()}
                  disabled={isGeneratingSuggestion}
                  className={`w-full py-2 px-3 rounded-md text-sm font-medium text-white ${isGeneratingSuggestion ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'} transition-all duration-300 flex items-center justify-center`}
                >
                  {isGeneratingSuggestion ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating suggestion...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Suggestion
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced tag suggestions with categories */}
        {!isUploading && (
          <div className="mt-4">
            {Object.entries(tagSuggestions).map(([category, tags], categoryIndex) => (
              <div key={category} className="mb-3">
                <h3 className="text-xs font-medium text-indigo-800 mb-2">{category}:</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, tagIndex) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * (tagIndex + categoryIndex * 5) }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setUserDescription(
                          userDescription + (userDescription ? " " : "") + tag
                        )
                      }
                      className="px-3 py-1 bg-white hover:bg-indigo-100 text-indigo-700 text-sm rounded-full border border-indigo-200 transition-all duration-300 shadow-sm hover:shadow flex items-center"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

    </motion.div>
  );
};

export default DescriptionInput;
