"use client";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import React, { useEffect, useState } from "react";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Filter, Grid, List, SortAsc, SortDesc, Code, Image as ImageIcon, Calendar, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

interface Design {
  id: number;
  uid: string;
  model: string;
  imageUrl: string;
  code: unknown;
  description: string | null;
  createdAt: string;
  options: unknown;
}

function DesignsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get unique models for filter dropdown
  const uniqueModels = [...new Set(designs.map(design => design.model))];

  useEffect(() => {
    console.log(user, "user");
  }, [user]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError("");
      if (user && user.id) {
        const result = await db
          .select()
          .from(imagetocodeTable)
          .where(
            eq(
              imagetocodeTable.email,
              user.primaryEmailAddress?.emailAddress ?? ""
            )
          )
          .orderBy(desc(imagetocodeTable.uid));

        // Add some sample designs for demonstration if none exist
        if (result.length === 0) {
          const sampleDesigns = [
            {
              id: 1,
              uid: "sample-1",
              model: "GPT-4",
              imageUrl: "https://placehold.co/600x400/5271ff/ffffff?text=Sample+Design+1",
              code: { content: "<div>Sample code</div>" },
              description: "Sample Login Page",
              createdAt: new Date().toISOString(),
              options: {},
            },
            {
              id: 2,
              uid: "sample-2",
              model: "Claude",
              imageUrl: "https://placehold.co/600x400/ff5271/ffffff?text=Sample+Design+2",
              code: { content: "<div>Sample code</div>" },
              description: "Sample Dashboard",
              createdAt: "2025-02-25T00:00:00.000Z", // 1 day ago
              options: {},
            },
            {
              id: 3,
              uid: "sample-3",
              model: "GPT-4",
              imageUrl: "https://placehold.co/600x400/52ff71/ffffff?text=Sample+Design+3",
              code: { content: "<div>Sample code</div>" },
              description: "Sample Product Page",
              createdAt: "2025-02-24T00:00:00.000Z", // 2 days ago
              options: {},
            },
          ];
          setDesigns(sampleDesigns as Design[]);
        } else {
          const validDesigns = result.filter(design => design.code != null);
          setDesigns(validDesigns as Design[]);
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
    .filter((design, index, self) => 
      index === self.findIndex((d) => d.uid === design.uid)
    )
    .filter(design => {
      // Apply search filter
      const matchesSearch = !searchTerm || 
        (design.description && design.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        design.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply model filter
      const matchesModel = !filterModel || design.model === filterModel;
      
      return matchesSearch && matchesModel;
    })
    .sort((a, b) => {
      // Sort by creation date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-r-blue-500 rounded-full animate-ping"></div>
        </div>
        <p className="mt-6 text-xl font-medium text-purple-800">Loading your designs...</p>
        <p className="text-gray-500">Fetching your creative masterpieces</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gradient-to-r from-red-50 to-pink-50 p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-500 text-center mb-6">{error}</p>
          <Button 
            onClick={fetchDesigns}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header with animated gradient */}
        <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              animate={{ 
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 20,
                ease: "linear"
              }}
              className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-3xl"
            />
            <motion.div 
              animate={{ 
                x: [0, -100, 0],
                y: [0, -50, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 15,
                ease: "linear"
              }}
              className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-purple-400 opacity-20 blur-3xl"
            />
          </div>
          
          <div className="relative p-8 sm:p-10 text-white z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold mb-2"
            >
              Your Design Collection
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-blue-100 max-w-2xl"
            >
              Browse, filter, and manage all your AI-generated designs in one place. 
              Click on any design to view details and edit the generated code.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-blue-400 rounded-lg bg-blue-700/20 backdrop-blur-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterModel || ""}
                  onChange={(e) => setFilterModel(e.target.value || null)}
                  className="px-4 py-2 border border-blue-400 rounded-lg bg-blue-700/20 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">All Models</option>
                  {uniqueModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                
                <Button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-4 py-2 bg-blue-700/30 hover:bg-blue-700/50 border border-blue-400 rounded-lg backdrop-blur-sm"
                >
                  {sortOrder === "asc" ? <SortAsc className="h-5 w-5" /> : <SortDesc className="h-5 w-5" />}
                </Button>
                
                <Button
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="px-4 py-2 bg-blue-700/30 hover:bg-blue-700/50 border border-blue-400 rounded-lg backdrop-blur-sm"
                >
                  {viewMode === "grid" ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                </Button>
                
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-4 py-2 bg-blue-700/30 hover:bg-blue-700/50 border border-blue-400 rounded-lg backdrop-blur-sm"
                >
                  <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-8 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="p-3 rounded-full bg-blue-100 mr-3">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Designs</p>
                <p className="text-xl font-bold text-gray-800">{designs.length}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
              <div className="p-3 rounded-full bg-purple-100 mr-3">
                <Code className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Generated Code</p>
                <p className="text-xl font-bold text-gray-800">{designs.filter(d => d.code).length}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-pink-50 to-pink-100">
              <div className="p-3 rounded-full bg-pink-100 mr-3">
                <Calendar className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-xl font-bold text-gray-800">
                  {designs.filter(d => {
                    const date = new Date(d.createdAt);
                    const now = new Date();
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return date >= weekAgo;
                  }).length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100">
              <div className="p-3 rounded-full bg-green-100 mr-3">
                <Filter className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Filtered Results</p>
                <p className="text-xl font-bold text-gray-800">{filteredAndSortedDesigns.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Designs grid/list */}
        {filteredAndSortedDesigns.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-10 text-center shadow-md"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No designs found</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || filterModel 
                ? "Try adjusting your search or filters to see more results." 
                : "Create your first design to get started with AI-powered code generation."}
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all">
                Create New Design
              </Button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedDesigns.map((design, index) => (
                  <motion.div
                    key={design.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={`/designs/${design.uid}`} className="block">
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                        <img
                          src={design.imageUrl}
                          alt={design.description || "Design preview"}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute bottom-3 left-3 z-20">
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            {design.model}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-1">
                          {design.description || "Untitled Design"}
                        </h3>
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(design.createdAt)}
                          </span>
                          
                          <span className="text-blue-600 text-sm font-medium">View Details →</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedDesigns.map((design, index) => (
                  <motion.div
                    key={design.uid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Link href={`/designs/${design.uid}`} className="block">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-48 h-40">
                          <img
                            src={design.imageUrl}
                            alt={design.description || "Design preview"}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                              {design.model}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-5 flex-grow">
                          <h3 className="font-bold text-xl mb-2 text-gray-800">
                            {design.description || "Untitled Design"}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            A design created with {design.model} on {formatDate(design.createdAt)}
                          </p>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              UID: {design.uid.substring(0, 8)}...
                            </span>
                            
                            <span className="text-blue-600 text-sm font-medium">View Details →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default DesignsPage;
