"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import { eq, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
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
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
    fetchDesigns();
  }, [user]);

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

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} retryFn={fetchDesigns} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header */}
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
                className={`p-2 rounded-full ${showFilters
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
                    onChange={(e) => setFilterModel(e.target.value || null)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  >
                    <option value="">All Models</option>
                    {uniqueModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white shadow-sm" : ""
                        }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md ${viewMode === "list" ? "bg-white shadow-sm" : ""
                        }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                    }
                    className="flex items-center bg-gray-100 rounded-lg p-2"
                  >
                    {sortOrder === "desc" ? (
                      <ArrowDownAZ className="w-5 h-5" />
                    ) : (
                      <ArrowUpZA className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Stats Section with Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className=" mb-6"
        >
          {/* Stats Cards */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-75">Total Designs</p>
                <p className="text-3xl font-bold">{designs.length}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-75">With Code</p>
                <p className="text-3xl font-bold">
                  {designs.filter((d) => d.code).length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-75">This Week</p>
                <p className="text-3xl font-bold">
                  {
                    designs.filter((d) => {
                      const date = parseDate(d.createdAt);
                      const now = new Date();
                      const weekAgo = new Date(
                        now.getTime() - 7 * 24 * 60 * 60 * 1000
                      );
                      return date && date >= weekAgo;
                    }).length
                  }
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-75">Filtered Results</p>
                <p className="text-3xl font-bold">
                  {filteredAndSortedDesigns.length}
                </p>
              </div>
            </div>
          </div>


        </motion.div>

        {/* Designs Content */}
        {filteredAndSortedDesigns.length === 0 ? (
          <EmptyState hasSearchOrFilter={!!(searchTerm || filterModel)} />
        ) : viewMode === "grid" ? (
          <DesignsGrid designs={filteredAndSortedDesigns} />
        ) : (
          <DesignsList designs={filteredAndSortedDesigns} />
        )}
      </div>
    </div>
  );
}

function DesignsGrid({ designs }: DesignsGridProps) {
  const router = useRouter();

  const handleDesignClick = (uid: string) => {
    router.push(`/designs/${uid}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map((design, index) => (
        <motion.div
          key={design.uid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => handleDesignClick(design.uid)}
        >
          <div className="relative pb-[60%] overflow-hidden">
            <img
              src={
                design.imageUrl ||
                "https://placehold.co/600x400/5271ff/ffffff?text=No+Image"
              }
              alt={design.description || "Design"}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/600x400/5271ff/ffffff?text=Error+Loading+Image";
              }}
            />
            <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {design.model}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 line-clamp-1">
              {design.description || "Untitled Design"}
            </h3>
            <p className="text-gray-500 text-sm mb-3">
              {(() => {
                const date = parseDate(design.createdAt);
                return date
                  ? date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                  : "Invalid Date";
              })()}
            </p>
            <div className="flex justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDesignClick(design.uid);
                }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                View
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/designs/${design.uid}/edit`);
                }}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                Edit
              </button>
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
    router.push(`/designs/${uid}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Design
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Model
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {designs.map((design, index) => (
              <motion.tr
                key={design.uid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleDesignClick(design.uid)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                      <img
                        src={
                          design.imageUrl ||
                          "https://placehold.co/600x400/5271ff/ffffff?text=No+Image"
                        }
                        alt={design.description || "Design"}
                        className="h-10 w-10 object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {design.description || "Untitled Design"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {design.model}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(() => {
                    const date = parseDate(design.createdAt);
                    return date
                      ? date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      : "Invalid Date";
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDesignClick(design.uid);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/designs/${design.uid}/edit`);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Clone functionality can be added here
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Clone
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DesignsPage;
