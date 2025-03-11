"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import { eq, desc } from "drizzle-orm";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

import {
  Search,
  Grid,
  List,
  ArrowDownAZ,
  ArrowUpZA,
  RefreshCw,
  Filter,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Components
import LoadingState from "./_component/LoadingState";
import ErrorState from "./_component/ErrorState";
import EmptyState from "./_component/EmptyState";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

interface Design {
  id: number;
  uid: string;
  model: string;
  imageUrl: string;
  code: { content: string };
  description: string | null;
  email: string | null;
  createdAt: string;
  options: string[];
}

interface DesignsGridProps {
  designs: Design[];
}

interface DesignsListProps {
  designs: Design[];
}

// Helper function to safely parse dates
const parseDate = (dateString: string): Date | null => {
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
};

function DesignsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get unique models for filter dropdown
  const uniqueModels = [...new Set(designs.map((design) => design.model))];

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await db
        .select()
        .from(imagetocodeTable)
        .orderBy(desc(imagetocodeTable.createdAt))
        .limit(50);

      if (result) {
        if (result.length === 0) {
          // Sample designs for empty state
          const sampleDesigns: Design[] = [
            {
              id: 1,
              uid: "sample-1",
              model: "GPT-4",
              imageUrl:
                "https://placehold.co/600x400/5271ff/ffffff?text=Sample+Design+1",
              code: { content: "<div>Sample code</div>" },
              description: "Sample Login Page",
              email: null,
              createdAt: new Date().toISOString(),
              options: [],
            },
            {
              id: 2,
              uid: "sample-2",
              model: "Claude",
              imageUrl:
                "https://placehold.co/600x400/ff5271/ffffff?text=Sample+Design+2",
              code: { content: "<div>Sample code</div>" },
              description: "Sample Dashboard",
              email: null,
              createdAt: "2025-02-25T00:00:00.000Z",
              options: [],
            },
            {
              id: 3,
              uid: "sample-3",
              model: "GPT-4",
              imageUrl:
                "https://placehold.co/600x400/52ff71/ffffff?text=Sample+Design+3",
              code: { content: "<div>Sample code</div>" },
              description: "Sample Product Page",
              email: null,
              createdAt: "2025-02-24T00:00:00.000Z",
              options: [],
            },
          ];
          setDesigns(sampleDesigns);
        } else {
          const validDesigns = result
            .filter((design): design is Design => {
              if (!design.code || typeof design.code !== 'object') return false;
              const code = design.code as { content?: string };
              return typeof code.content === 'string';
            })
            .map(design => ({
              ...design,
              code: typeof design.code === 'string' 
                ? { content: design.code }
                : design.code as { content: string },
              options: Array.isArray(design.options) ? design.options : []
            }));
          setDesigns(validDesigns);
        }
      }
    } catch (err) {
      setError("Failed to fetch designs. Please try again later.");
      console.error("Error fetching designs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDesigns();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchDesigns();
    }
  }, [user, isSignedIn]);

  // Filter and sort designs
  const filteredAndSortedDesigns = designs
    // First ensure there are no duplicate UIDs
    .filter(
      (design, index, self) =>
        index === self.findIndex((d) => d.uid === design.uid)
    )
    .filter((design) => {
      // Apply search filter
      const matchesSearch =
        !searchTerm ||
        (design.description &&
          design.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        design.model.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply model filter
      const matchesModel = !filterModel || design.model === filterModel;

      return matchesSearch && matchesModel;
    })
    .sort((a, b) => {
      // Sort by creation date
      const dateA = parseDate(a.createdAt);
      const dateB = parseDate(b.createdAt);
      if (!dateA || !dateB) return 0;
      return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

  // Prepare data for charts
  const modelData = uniqueModels.map((model) => ({
    name: model,
    value: designs.filter((d) => d.model === model).length,
  }));

  const weeklyData = Array(7)
    .fill(0)
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      return {
        name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
        count: designs.filter((design) => {
          const designDate = parseDate(design.createdAt);
          return designDate && designDate.toISOString().split("T")[0] === dateStr;
        }).length,
      };
    });

  if (!isClient) {
    return null; // Prevent flash of content during hydration
  }

  if (loading && isSignedIn) {
    return <LoadingState />;
  }

  if (error && isSignedIn) {
    return <ErrorState error={error} retryFn={fetchDesigns} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <SignedIn>
          {/* Content only visible to signed in users */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-4 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4 sm:mb-0">
                My Designs
              </h1>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-full ${
                    showFilters
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-600"
                  } hover:bg-purple-200 transition-colors`}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search Box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search designs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative">
                    <select
                      value={filterModel || ""}
                      onChange={(e) =>
                        setFilterModel(
                          e.target.value === "" ? null : e.target.value
                        )
                      }
                      className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                    >
                      <option value="">All Models</option>
                      {uniqueModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  {/* View & Sort Controls */}
                  <div className="flex space-x-2">
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`px-3 py-2 ${
                          viewMode === "grid"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        <Grid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-2 ${
                          viewMode === "list"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        onClick={() => setSortOrder("desc")}
                        className={`px-3 py-2 ${
                          sortOrder === "desc"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        <ArrowDownAZ className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSortOrder("asc")}
                        className={`px-3 py-2 ${
                          sortOrder === "asc"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        <ArrowUpZA className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Designs Display */}
          {filteredAndSortedDesigns.length === 0 ? (
            <EmptyState hasSearchOrFilter={!!(searchTerm || filterModel)} />
          ) : viewMode === "grid" ? (
            <DesignsGrid designs={filteredAndSortedDesigns} />
          ) : (
            <DesignsList designs={filteredAndSortedDesigns} />
          )}
        </SignedIn>
        
        <SignedOut>
          {/* Content only visible to signed out users */}
          <motion.div
            className="flex flex-col items-center justify-center min-h-[70vh] text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Your Designs Collection
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Please sign in to view your design collection and conversion history.
            </p>
            
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
              <SignInButton mode="modal">
                Sign In to View Designs
              </SignInButton>
            </div>
          </motion.div>
        </SignedOut>
      </div>
    </div>
  );
}

function DesignsGrid({ designs }: DesignsGridProps) {
  const router = useRouter();
  const handleDesignClick = (uid: string) => {
    router.push(`/view-code/${uid}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map((design) => (
        <motion.div
          key={design.uid}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => handleDesignClick(design.uid)}
        >
          <div className="relative aspect-video bg-gray-100">
            <img
              src={design.imageUrl}
              alt={design.description || "Design preview"}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/600x400/5271ff/ffffff?text=Image+Not+Available";
              }}
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
              {design.model}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 truncate">
              {design.description || "Untitled Design"}
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {parseDate(design.createdAt)
                  ? new Date(design.createdAt).toLocaleDateString()
                  : "Unknown date"}
              </span>
              <div className="flex space-x-1">
                {design.options &&
                  design.options.slice(0, 3).map((option, idx) => (
                    <span
                      key={idx}
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    ></span>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DesignsList({ designs }: DesignsListProps) {
  const router = useRouter();
  const handleDesignClick = (uid: string) => {
    router.push(`/view-code/${uid}`);
  };

  return (
    <div className="space-y-4">
      {designs.map((design) => (
        <motion.div
          key={design.uid}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.99 }}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => handleDesignClick(design.uid)}
        >
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-48 h-32 bg-gray-100 relative flex-shrink-0">
              <img
                src={design.imageUrl}
                alt={design.description || "Design preview"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400/5271ff/ffffff?text=Image+Not+Available";
                }}
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                {design.model}
              </div>
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-semibold text-lg mb-1">
                {design.description || "Untitled Design"}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {parseDate(design.createdAt)
                    ? new Date(design.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>
                <div className="flex space-x-1">
                  {design.options &&
                    design.options.map((option, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
                      >
                        {option}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default DesignsPage;
