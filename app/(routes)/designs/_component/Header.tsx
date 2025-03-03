import React from "react";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc, Grid, List, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { HeaderProps } from "./types";

function Header({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  sortOrder,
  setSortOrder,
  filterModel,
  setFilterModel,
  uniqueModels,
  isRefreshing,
  handleRefresh,
}: HeaderProps) {
  return (
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
            ease: "linear",
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
            ease: "linear",
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
              {uniqueModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

            <Button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 bg-blue-700/30 hover:bg-blue-700/50 border border-blue-400 rounded-lg backdrop-blur-sm"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-5 w-5" />
              ) : (
                <SortDesc className="h-5 w-5" />
              )}
            </Button>

            <Button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="px-4 py-2 bg-blue-700/30 hover:bg-blue-700/50 border border-blue-400 rounded-lg backdrop-blur-sm"
            >
              {viewMode === "grid" ? (
                <List className="h-5 w-5" />
              ) : (
                <Grid className="h-5 w-5" />
              )}
            </Button>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-blue-700/30 hover:bg-blue-700/50 border border-blue-400 rounded-lg backdrop-blur-sm"
            >
              <RefreshCw
                className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Header;
