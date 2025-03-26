import React from 'react';
import { motion } from 'framer-motion';
import { Filter, RefreshCw, Sparkles, LayoutGrid, Download, Share2 } from 'lucide-react';

interface DesignsHeaderProps {
  isRefreshing: boolean;
  showFilters: boolean;
  handleRefresh: () => void;
  toggleFilters: () => void;
}

const DesignsHeader: React.FC<DesignsHeaderProps> = ({
  isRefreshing,
  showFilters,
  handleRefresh,
  toggleFilters,
  
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 border border-white/30"
    >
      {/* Decorative background elements */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-40 z-0"></div>
      <div className="absolute -bottom-24 -left-10 w-48 h-48 bg-indigo-100 rounded-full blur-3xl opacity-40 z-0"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mr-4 relative"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 blur-md opacity-70 animate-pulse"></div>
                <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <LayoutGrid className="h-6 w-6 text-white" />
                  <motion.div
                    className="absolute -top-1 -right-1 text-yellow-400"
                    animate={{ rotate: [0, 10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-3 w-3" />
                  </motion.div>
                </div>
              </motion.div>
              
              <div>
                <motion.h1 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  My Designs
                </motion.h1>
                <motion.p 
                  className="text-gray-500 text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Manage and organize your design collection
                </motion.p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
         
            {/* Refresh button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="relative p-2.5 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors group"
              disabled={isRefreshing}
            >
              <div className="absolute inset-0 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 opacity-80 backdrop-blur-md z-0"></div>
              <RefreshCw
                className={`w-5 h-5 relative z-10 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </motion.button>

            {/* Filter toggle button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFilters}
              className={`relative p-2.5 rounded-lg transition-colors group
                ${showFilters 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"}
              `}
            >
              <div className={`absolute inset-0 rounded-lg ${showFilters ? "bg-gradient-to-r from-indigo-500 to-purple-600" : "bg-indigo-100 group-hover:bg-indigo-200"} opacity-80 backdrop-blur-md z-0`}></div>
              <Filter className="w-5 h-5 relative z-10" />
            </motion.button>
          </div>
        </div>
        
       
      </div>
    </motion.div>
  );
};

export default DesignsHeader;
