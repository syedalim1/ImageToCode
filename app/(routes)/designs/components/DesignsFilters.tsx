import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, Grid, List, ArrowDownAZ, ArrowUpZA, Filter, Sparkles, Sliders } from 'lucide-react';

interface DesignsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterModel: string | null;
  setFilterModel: (model: string | null) => void;
  uniqueModels: string[];
  viewMode: string;
  setViewMode: (mode: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const DesignsFilters: React.FC<DesignsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterModel,
  setFilterModel,
  uniqueModels,
  viewMode,
  setViewMode,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="mb-6"
    >
      <div className="relative p-5 rounded-xl bg-white/70 backdrop-blur-md shadow-lg border border-white/30 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-200 rounded-full blur-2xl opacity-30"></div>

        {/* Filter header */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Sliders className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">Filters & View Options</h3>
          </motion.div>

        </div>

        <div className="flex sm:justify-between w-full gap-4 flex-col sm:flex-row">
          {/* Search Box with enhanced styling */}
          <motion.div
            className="relative group"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5 group-hover:text-purple-600 transition-colors" />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* View & Sort Controls with enhanced styling */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex space-x-2"
          >
            <div className="relative flex-1 group">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative flex rounded-lg overflow-hidden border border-gray-200 bg-white/90">
                <motion.button
                  onClick={() => setViewMode("grid")}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 1 }}
                  className={`flex-1 px-3 py-2.5 flex items-center justify-center gap-1.5 transition-colors duration-200 ${viewMode === "grid"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                      : "bg-white text-gray-700 hover:bg-indigo-50"
                    }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Grid</span>
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("list")}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 1 }}
                  className={`flex-1 px-3 py-2.5 flex items-center justify-center gap-1.5 transition-colors duration-200 ${viewMode === "list"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                      : "bg-white text-gray-700 hover:bg-indigo-50"
                    }`}
                >
                  <List className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">List</span>
                </motion.button>
              </div>
            </div>

            <div className="relative flex-1 group">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative flex rounded-lg overflow-hidden border border-gray-200 bg-white/90">
                <motion.button
                  onClick={() => setSortOrder("desc")}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 1 }}
                  className={`flex-1 px-3 py-2.5 flex items-center justify-center gap-1.5 transition-colors duration-200 ${sortOrder === "desc"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                      : "bg-white text-gray-700 hover:bg-purple-50"
                    }`}
                >
                  <ArrowDownAZ className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Newest</span>
                </motion.button>
                <motion.button
                  onClick={() => setSortOrder("asc")}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 1 }}
                  className={`flex-1 px-3 py-2.5 flex items-center justify-center gap-1.5 transition-colors duration-200 ${sortOrder === "asc"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                      : "bg-white text-gray-700 hover:bg-purple-50"
                    }`}
                >
                  <ArrowUpZA className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Oldest</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignsFilters;
