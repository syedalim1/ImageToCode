"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import { eq, desc } from "drizzle-orm";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

import {
  Search,
  Grid,
  List,
  ArrowDownAZ,
  ArrowUpZA,
  RefreshCw,
  Filter,
  X,
  Delete,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Components
import LoadingState from "./_component/LoadingState";
import ErrorState from "./_component/ErrorState";
import EmptyState from "./_component/EmptyState";
import { Button } from "@/components/ui/button";

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
  onDelete: (uid: string) => Promise<void>;
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

      // Get the current user's email
      const userEmail = user?.emailAddresses?.[0]?.emailAddress;

      // BUG FIX: Only show designs belonging to the current user instead of all designs
      // This addresses the issue where all designs were being shown to everyone
      let result;
      if (userEmail) {
        // If user is logged in, fetch only their designs
        result = await db
          .select()
          .from(imagetocodeTable)
          .where(eq(imagetocodeTable.email, userEmail))
          .orderBy(desc(imagetocodeTable.createdAt))
          .limit(50);
      } else {
        // If no email (shouldn't happen if logged in), fetch with no email filter
        result = await db
          .select()
          .from(imagetocodeTable)
          .orderBy(desc(imagetocodeTable.createdAt))
          .limit(50);
      }

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
              if (!design.code || typeof design.code !== "object") return false;
              const code = design.code as { content?: string };
              return typeof code.content === "string";
            })
            .map((design) => ({
              ...design,
              code:
                typeof design.code === "string"
                  ? { content: design.code }
                  : (design.code as { content: string }),
              options: Array.isArray(design.options) ? design.options : [],
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
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
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
          return (
            designDate && designDate.toISOString().split("T")[0] === dateStr
          );
        }).length,
      };
    });

  const handleDelete = async (uid: string) => {
    try {
      // Delete the design from the database
      await db.delete(imagetocodeTable).where(eq(imagetocodeTable.uid, uid));

      // Update the local state to remove the deleted design
      setDesigns((prevDesigns) =>
        prevDesigns.filter((design) => design.uid !== uid)
      );

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff0000", "#ff6b6b", "#ffd93d"],
        shapes: ["circle", "square"],
        scalar: 0.8,
        ticks: 200,
        gravity: 0.5,
        drift: 0,
      });

      // Show success toast with custom styling
      toast.success("Design deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "linear-gradient(to right, #ff6b6b, #ff8e8e)",
          color: "white",
          borderRadius: "8px",
          padding: "12px 24px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      });
    } catch (error) {
      console.error("Error deleting design:", error);
      setError("Failed to delete design. Please try again.");

      // Show error toast with custom styling
      toast.error("Failed to delete design", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "linear-gradient(to right, #ff4444, #ff6b6b)",
          color: "white",
          borderRadius: "8px",
          padding: "12px 24px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  };

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
            <DesignsGrid
              designs={filteredAndSortedDesigns}
              onDelete={handleDelete}
            />
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
              Please sign in to view your design collection and conversion
              history.
            </p>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
              <SignInButton mode="modal">Sign In to View Designs</SignInButton>
            </div>
          </motion.div>
        </SignedOut>
      </div>
    </div>
  );
}

function DesignsGrid({ designs, onDelete }: DesignsGridProps) {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDesignClick = (uid: string) => {
    router.push(`/designs/${uid}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, uid: string) => {
    e.stopPropagation();
    setDeleteConfirm(uid);
  };

  const confirmDelete = (uid: string) => {
    onDelete(uid)
      .then(() => {
        toast.success("Design deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(() => {
        toast.error("Failed to delete design", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .finally(() => {
        setDeleteConfirm(null);
      });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map((design) => (
        <motion.div
          key={design.uid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative"
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
                  design.options
                    .slice(0, 3)
                    .map((option, idx) => (
                      <span
                        key={idx}
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      ></span>
                    ))}
              </div>
            </div>
            <Button
              className="w-full mt-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2 group"
              onClick={(e) => handleDeleteClick(e, design.uid)}
            >
              <span>Delete Design</span>
              <Trash2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </Button>
          </div>

          <AnimatePresence>
            {deleteConfirm === design.uid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-8 h-8 text-red-500 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Delete Design?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to delete this design? This action
                      cannot be undone.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => setDeleteConfirm(null)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => confirmDelete(design.uid)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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
